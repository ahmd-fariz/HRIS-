import express from "express";
// Buat email dan jalan otomatis
import nodemailer from "nodemailer";
import { google } from "googleapis";
import cron from "node-cron";
import dotenv from "dotenv";

import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";
import Alpha from "../models/Alpha.js";
import Role from "../models/Role.js";
import HariLibur from "../models/HariLibur.js";

const router = express.Router();

// Function to get all attendance records
export const GetAbsens = async(req, res) => {
    try {
        const response = await Absen.findAll({
            include: {
                model: UserModel,
                attributes: ["name", "roleId"],
                include: {
                    model: Role,
                    attributes: ["nama_role"],
                },
            },
            attributes: [
                "userId",
                "tanggal",
                "waktu_datang",
                "waktu_keluar",
                "lat",
                "long",
                "foto",
                "url_foto",
                "keterangan",
                "alasan",
            ],
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Function to create new attendance record
export const createAbsen = async(req, res) => {
    const { userId, lat, long } = req.body;

    console.log("Request received to create absen for userId:", userId);

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const waktu_datang = today.toLocaleTimeString("en-GB");

    try {
        const existingAbsen = await Absen.findOne({
            where: {
                userId,
                tanggal: date,
            },
        });

        if (existingAbsen) {
            return res.status(400).json({ msg: "User sudah absen hari ini." });
        }

        const absen = await Absen.create({
            userId,
            tanggal: date,
            lat,
            long,
            waktu_datang,
            keterangan: "Hadir",
        });

        console.log("Absen created:", absen);

        res.status(201).json({ msg: "Absen berhasil dibuat", absen });
    } catch (error) {
        console.error("Error creating absen:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Function to check and mark absentees
const checkAndMarkAbsentees = async() => {
    const now = new Date();

    try {
        // Get jam_alpha from alpha table with id 1
        const alphaRecord = await Alpha.findOne({
            where: { id: 1 },
            attributes: ["jam_alpha"],
        });

        if (!alphaRecord) {
            console.log("Alpha record not found.");
            return;
        }

        const jamAlpha = alphaRecord.jam_alpha;
        const [hours, minutes] = jamAlpha.split(":").map(Number);

        // Compare current time with jam_alpha
        if (
            now.getHours() < hours ||
            (now.getHours() === hours && now.getMinutes() < minutes)
        ) {
            console.log(
                "Current time has not exceeded jam_alpha, skipping the check."
            );
            return;
        }

        const date = now.toISOString().split("T")[0];

        // Check if today is a holiday
        const isHoliday = await HariLibur.findOne({
            where: { tanggal_hari_libur: date },
        });

        if (isHoliday) {
            console.log(
                `Today (${date}) is a holiday (${isHoliday.nama_libur}), no absentees will be marked.`
            );
            return;
        }

        // Get all user IDs excluding Managers, Admins, and Non-Aktif users
        const allUsers = await UserModel.findAll({
            include: {
                model: Role,
                attributes: ["nama_role"],
                where: {
                    nama_role: {
                        [Sequelize.Op.notIn]: ["Manager", "Admin"], // Exclude Managers and Admins
                    },
                },
            },
            attributes: ["id", "status"],
            where: {
                status: {
                    [Sequelize.Op.notIn]: ["Non-Aktif"], // Exclude Managers and Admins
                },
            },
        });

        // Filter out Non-Aktif users
        const activeUsers = allUsers.filter((user) => user.status === "Aktif");
        const allUserIds = activeUsers.map((user) => user.id);

        // Get user IDs who have checked in today
        const presentUsers = await Absen.findAll({
            where: {
                tanggal: date,
            },
            attributes: ["userId"],
        });

        const presentUserIds = presentUsers.map((absen) => absen.userId);

        // Find user IDs who have not checked in today
        const absentUserIds = allUserIds.filter(
            (userId) => !presentUserIds.includes(userId)
        );

        console.log(`Absent users for ${date}:`, absentUserIds);

        // Mark absent users
        const waktuDatang = now.toTimeString().split(" ")[0]; // Ambil waktu lengkap (HH:MM:SS)
        const newAbsens = absentUserIds.map((userId) => ({
            userId,
            tanggal: date,
            lat: null,
            long: null,
            waktu_datang: waktuDatang, // Simpan waktu lengkap (HH:MM:SS)
            keterangan: "Alpha",
        }));

        if (newAbsens.length > 0) {
            await Absen.bulkCreate(newAbsens);
            console.log(`${newAbsens.length} users marked as Alpha for ${date}`);
        } else {
            console.log(`No users to mark as Alpha for ${date}`);
        }
    } catch (error) {
        console.error("Error checking and marking absentees:", error);
    }
};

// Schedule cron job to run every minute
cron.schedule("* * * * *", checkAndMarkAbsentees);

// Run the function once to initialize after truncate
checkAndMarkAbsentees();

// Function to update the checkout time
export const AbsenKeluar = async(req, res) => {
    const { userId, reason } = req.body;

    console.log("Request received to update absen for userId:", userId);

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const waktu_keluar = today.toLocaleTimeString("en-GB");

    try {
        const absen = await Absen.update({ waktu_keluar, alasan: reason }, {
            where: {
                userId,
                tanggal: date,
            },
        });

        console.log("Absen Pulang:", absen);

        res.status(200).json({ msg: "Berhasil Pulang", absen });
    } catch (error) {
        console.error("Error updating absen:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const GeoLocation = async(req, res) => {
    const { userId, lat, long, keterangan, alasan, foto } = req.body;

    console.log("Request received to update absen for userId:", userId);

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const waktu_datang = today.toLocaleTimeString("en-GB");

    try {
        // Pastikan foto ada dan berbentuk string
        if (!foto) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        // Ekstrak data base64 dan tipe gambar (ekstensi file)
        const matches = foto.match(/^data:image\/(png|jpg|jpeg);base64,(.+)$/);
        if (!matches) {
            return res.status(422).json({ msg: "Invalid Image Data" });
        }

        const ext = matches[1]; // Ekstrak ekstensi (png/jpg/jpeg)
        const base64Data = matches[2]; // Ekstrak data base64 gambar

        // Generate nama file yang unik
        const fileName = `${userId}-${Date.now()}.${ext}`;
        const filePath = path.join("./public/geolocation", fileName); // Path untuk menyimpan file

        // Konversi base64 menjadi buffer binary
        const buffer = Buffer.from(base64Data, "base64");

        // Simpan buffer sebagai file di direktori yang ditentukan
        fs.writeFile(filePath, buffer, async(err) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }

            // Buat URL file gambar yang baru disimpan
            const url = `${req.protocol}://${req.get(
        "host"
      )}/geolocation/${fileName}`;

            try {
                // Simpan data absen ke database
                const absen = await Absen.create({
                    userId,
                    tanggal: date,
                    lat,
                    long,
                    waktu_datang,
                    keterangan,
                    foto: fileName,
                    url_foto: url,
                    alasan,
                });

                console.log("Absen Geolocation:", absen);
                res.status(200).json({ msg: "Berhasil Update Geolocation", absen });
            } catch (error) {
                console.error("Error updating absen:", error);
                res.status(500).json({ msg: error.message });
            }
        });
    } catch (error) {
        console.error("Error processing geolocation:", error);
        res.status(500).json({ msg: error.message });
    }
};

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const OAuth2Client = new OAuth2(
    process.env.GOOGLE_GMAIL_CLIENT_ID,
    process.env.GOOGLE_GMAIL_CLIENT_SECRET,
    process.env.GOOGLE_GMAIL_REDIRECT_URL
);

OAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
});

async function getAccessToken() {
    try {
        const { token } = await OAuth2Client.getAccessToken();
        return token;
    } catch (err) {
        console.error("Failed to create access token", err);
        throw new Error("Failed to create access token");
    }
}

// Configure nodemailer transporter
const createTransporter = async() => {
    const accessToken = await getAccessToken();

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER, // Your email address
            clientId: process.env.GOOGLE_GMAIL_CLIENT_ID,
            clientSecret: process.env.GOOGLE_GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
};

// Function to get users marked as 'alpha' today along with their emails
const getUsersWithAlphaStatusToday = async() => {
    const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    try {
        const absens = await Absen.find({
            keterangan: "Alpha",
            tanggal: today,
        }).populate("userId");

        // Extract user information including email
        const users = absens.map((absen) => {
            const { _id, name, email } = absen.userId;
            return { id: _id, name, email };
        });

        return users;
    } catch (error) {
        console.error("Error fetching users with alpha status:", error);
        throw error;
    }
};

// Function to send email to users marked as 'alpha'
const sendAlphaEmails = async() => {
    try {
        const users = await getUsersWithAlphaStatusToday();
        if (users.length === 0) {
            console.log("No users marked as 'Alpha' today, skipping email sending.");
            return;
        }

        const transporter = await createTransporter();

        const emailPromises = users.map(async(user) => {
            if (!user.email) {
                console.log(`User ID ${user.id} does not have an email address.`);
                return;
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Attendance Reminder",
                text: `Dear ${user.name},
                       You have been marked as 'Alpha' today. Please ensure to adhere to the attendance policies.
                       Best regards,
                       PT. Grage Media Technology`,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`);
        });

        await Promise.all(emailPromises);
        console.log("All emails sent.");
    } catch (error) {
        console.error("Error sending alpha emails:", error);
    }
};

// Initialize cron job after ensuring the server is ready
const initializeAlphaEmailCronJob = async() => {
    try {
        const alphaRecord = await Alpha.findOne({
            where: { id: 1 },
            attributes: ["jam_alpha"],
        });

        if (!alphaRecord) {
            console.error("Alpha record not found.");
            return;
        }

        const jamAlpha = alphaRecord.jam_alpha;
        const [hours, minutes] = jamAlpha.split(":").map(Number);

        // Schedule email sending task based on 'jam_alpha'
        const cronSchedule = `${minutes} ${hours} * * *`; // Every day at jam_alpha
        cron.schedule(cronSchedule, () => {
            console.log("Running alpha email notification task");
            sendAlphaEmails();
        });

        console.log(
            `Alpha email notification cron job scheduled at ${hours}:${minutes}`
        );
    } catch (error) {
        console.error("Error initializing alpha email cron job:", error);
    }
};

// Call the function to initialize the cron job when the application starts
initializeAlphaEmailCronJob();

// Fungsi untuk mendapatkan detail pengguna berdasarkan userId untuk menampilkan persentase kehadiran selama sebulan
export const GetPercentageUser = async(req, res) => {
    try {
        const response = await Absen.findAll({
            attributes: ["userId", "tanggal", "keterangan"], // Mengambil atribut
            where: {
                userId: req.params.id, // Mencari pengguna berdasarkan id dari parameter route
            },
        });
        res.status(200).json(response); // Mengirimkan respon dengan status 200 dan data pengguna dalam format JSON
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respon dengan status 500 dan pesan error jika terjadi kesalahan
    }
};

export default router;