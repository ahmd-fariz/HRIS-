import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk mendapatkan semua data absen
export const GetAbsens = async (req, res) => {
  try {
    const response = await Absen.findAll({
      include: {
        model: UserModel,
        attributes: ["name", "role"],
      },
      attributes: [
        "userId",
        "tanggal",
        "waktu_datang",
        "waktu_keluar",
        "keterangan",
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

// Fungsi untuk mengupdate geolocation absen
export const GeoLocation = async (req, res) => {
  const { userId, lat, long, keterangan, alasan } = req.body;

  console.log("Request received to update absen for userId:", userId);

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const waktu_datang = today.toLocaleTimeString("en-GB");

  try {

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" }); // Mengirimkan respon dengan status 400 jika tidak ada file yang diunggah
    }
    // Mengecek apakah ada file yang diunggah
    const photo = req.files.file; // Mengambil file dari req.files
    const fileSize = file.data.lenght; // Mengukur ukuran file
    const ext = path.extname(photo.name); // Mendapatkan ekstensi file
    const fileName = file.md5 + ext; // Membuat nama file baru berdasarkan hash MD5 dan ekstensi
    const allowedType = [".png", ".jpg", ".jpeg"]; // Daftar ekstensi file gambar yang diizinkan

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" }); // Mengirimkan respon dengan status 422 jika ekstensi file tidak valid

    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" }); // Mengirimkan respon dengan status 422 jika ukuran file melebihi 5 MB

    // Hapus file lama dari direktori
    const filepath = `./public/geolocation/${absen.foto}`;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath); // Menghapus file jika ada
    }

    // Simpan file baru ke direktori
    file.mv(`./public/geolocation/${fileName}`, (err) => {
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
