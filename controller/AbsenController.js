import express from "express";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import cron from "node-cron";
import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";
import Alpha from "../models/Alpha.js";
import Role from "../models/Role.js";
import HariLibur from "../models/HariLibur.js";

const router = express.Router();

// Function to get all attendance records
export const GetAbsens = async (req, res) => {
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
export const createAbsen = async (req, res) => {
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
const checkAndMarkAbsentees = async () => {
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
    if (now.getHours() < hours || (now.getHours() === hours && now.getMinutes() < minutes)) {
      console.log("Current time has not exceeded jam_alpha, skipping the check.");
      return;
    }

    const date = now.toISOString().split("T")[0];

    // Check if today is a holiday
    const isHoliday = await HariLibur.findOne({
      where: { tanggal_hari_libur: date },
    });

    if (isHoliday) {
      console.log(`Today (${date}) is a holiday (${isHoliday.nama_libur}), no absentees will be marked.`);
      return;
    }

    // Get all user IDs
    const allUsers = await UserModel.findAll({
      attributes: ["id"],
    });

    const allUserIds = allUsers.map((user) => user.id);

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
    const newAbsens = absentUserIds.map((userId) => ({
      userId,
      tanggal: date,
      lat: null,
      long: null,
      waktu_datang: null,
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
export const AbsenKeluar = async (req, res) => {
  const { userId, reason } = req.body;

  console.log("Request received to update absen for userId:", userId);

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const waktu_keluar = today.toLocaleTimeString("en-GB");

  try {
    const absen = await Absen.update(
      { waktu_keluar, alasan: reason },
      {
        where: {
          userId,
          tanggal: date,
        },
      }
    );

    console.log("Absen Pulang:", absen);

    res.status(200).json({ msg: "Berhasil Pulang", absen });
  } catch (error) {
    console.error("Error updating absen:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const GeoLocation = async (req, res) => {
  const { userId, lat, long, keterangan, alasan } = req.body;

  console.log("Request received to update absen for userId:", userId);

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const waktu_datang = today.toLocaleTimeString("en-GB");

  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const foto = req.files.file;
    const fileSize = foto.data.length;
    const ext = path.extname(foto.name);
    const fileName = foto.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Image must be less than 5 MB" });
    }

    // Save new file to directory
    foto.mv(`./public/geolocation/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

    // Create new image URL
    const url = `${req.protocol}://${req.get("host")}/geolocation/${fileName}`;

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
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rfqfrashsym@gmail.com", // Ganti dengan email Anda
    pass: "your-app-password", // Ganti dengan password Anda (gunakan App Password jika 2FA diaktifkan)
  },
});

// Function to get users marked as 'alpha' today
const getUsersWithAlphaStatusToday = async () => {
  const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  try {
    // Fetch users with 'alpha' status for today
    const absens = await Absen.find({ keterangan: "Alpha", tanggal: today }).populate("userId");
    return absens.map((absen) => absen.userId);
  } catch (error) {
    console.error("Error fetching users with alpha status:", error);
    throw error;
  }
};

// Function to send email to users marked as 'alpha'
const sendAlphaEmails = async () => {
  try {
    const users = await getUsersWithAlphaStatusToday();
    for (const user of users) {
      const mailOptions = {
        from: "rfqfrashsym@gmail.com",
        to: user.email,
        subject: "Attendance Reminder",
        text: `Dear ${user.name},\n\nYou have been marked as 'Alpha' today. Please ensure to adhere to the attendance policies.\n\nBest regards,\nYour Company`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
    }
  } catch (error) {
    console.error("Error sending alpha emails:", error);
  }
};

// Schedule the email sending function to run at a specific time daily
cron.schedule("0 8 * * *", () => {
  console.log("Running alpha email notification task");
  sendAlphaEmails();
});

export default router;
