import express from "express";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";
import Alpha from "../models/Alpha.js";
import Role from "../models/Role.js";
import HariLibur from "../models/HariLibur.js";

const router = express.Router();

// Fungsi untuk mendapatkan semua data absen
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
        "keterangan",
        "foto",
        "url_foto",
        "lat",
        "long",
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat data absen baru
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

// Fungsi untuk mengecek dan menandai absensi
const checkAndMarkAbsentees = async () => {
  const now = new Date();
  
  try {
    // Mengambil jam_alpha dari tabel alpha dengan id 1
    const alphaRecord = await Alpha.findOne({
      where: { id: 1 },
      attributes: ['jam_alpha']
    });

    if (!alphaRecord) {
      console.log("Alpha record not found.");
      return;
    }

    const jamAlpha = alphaRecord.jam_alpha;
    const [hours, minutes] = jamAlpha.split(":").map(Number);

    // Membandingkan waktu saat ini dengan jam_alpha dari database
    if (now.getHours() >= hours && now.getMinutes() >= minutes) {
      console.log("Current time exceeds jam_alpha, skipping the check.");
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split("T")[0];

    // Mendapatkan daftar semua userId
    const allUsers = await UserModel.findAll({
      attributes: ["id"],
    });

    const allUserIds = allUsers.map((user) => user.id);

    // Mendapatkan daftar userId yang sudah absen kemarin
    const absentees = await Absen.findAll({
      where: {
        tanggal: date,
      },
      attributes: ["userId"],
    });

    const absenteesIds = absentees.map((absen) => absen.userId);

    // Menemukan userId yang tidak absen kemarin
    const nonAbsenteesIds = allUserIds.filter(
      (userId) => !absenteesIds.includes(userId)
    );

    console.log(`Non-absentees for ${date}:`, nonAbsenteesIds);

    // Menambahkan absen untuk user yang tidak absen kemarin
    const newAbsens = nonAbsenteesIds.map((userId) => ({
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

// Menjadwalkan cron job untuk menjalankan setiap menit
cron.schedule("* * * * *", checkAndMarkAbsentees);

// Jalankan fungsi sekali untuk mengisi data awal setelah truncate
checkAndMarkAbsentees();

// Fungsi untuk mengupdate waktu keluar absen
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
    // Mengecek apakah ada file yang diunggah
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" }); // Mengirimkan respon dengan status 400 jika tidak ada file yang diunggah
    }

    const foto = req.files.file; // Mengambil file dari req.files
    const fileSize = foto.data.length; // Mengukur ukuran file
    const ext = path.extname(foto.name); // Mendapatkan ekstensi file
    const fileName = foto.md5 + ext; // Membuat nama file baru berdasarkan hash MD5 dan ekstensi
    const allowedType = [".png", ".jpg", ".jpeg"]; // Daftar ekstensi file gambar yang diizinkan

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" }); // Mengirimkan respon dengan status 422 jika ekstensi file tidak valid
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Image must be less than 5 MB" }); // Mengirimkan respon dengan status 422 jika ukuran file melebihi 5 MB
    }

    // Simpan file baru ke direktori
    foto.mv(`./public/geolocation/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message }); // Mengirimkan respon dengan status 500 jika terjadi kesalahan saat memindahkan file
    });

    // Membuat URL file gambar baru
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

export default router;
