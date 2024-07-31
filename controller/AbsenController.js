import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";

// Fungsi untuk mendapatkan semua data absen
export const GetAbsens = async (req, res) => {
  try {
    // Mengambil semua data absen termasuk nama dan peran pengguna yang terkait
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

    // Mengirimkan respons sukses dengan data absen
    res.status(200).json(response);
  } catch (error) {
    // Menangani kesalahan dan mengirimkan respons dengan status 500
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat data absen baru
export const createAbsen = async (req, res) => {
  const { userId } = req.body;
  const { lat, long } = req.body;

  console.log("Request received to create absen for userId:", userId);

  // Mendapatkan tanggal dan waktu saat ini
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_datang = today.toLocaleTimeString("en-GB"); // Menggunakan en-GB untuk format 24 jam

  try {
    // Membuat data absen baru di database
    const absen = await Absen.create({
      userId,
      tanggal: date,
      lat: lat,
      long: long,
      waktu_datang,
      keterangan: "Hadir",
    });

    console.log("Absen created:", absen);

    // Mengirimkan respons sukses dengan data absen yang baru dibuat
    res.status(201).json({ msg: "Absen berhasil dibuat", absen });
  } catch (error) {
    console.error("Error creating absen:", error);
    // Menangani kesalahan dan mengirimkan respons dengan status 500
    res.status(500).json({ msg: error.message });
  }
};

export const AbsenKeluar = async (req, res) => {
  const { userId } = req.body;

  console.log("Request received to update absen for userId:", userId);

  // Mendapatkan tanggal dan waktu saat ini
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_keluar = today.toLocaleTimeString("en-GB"); // Menggunakan en-GB untuk format 24 jam

  try {
    // Mengupdate data absen di database
    const absen = await Absen.update(
      { waktu_keluar: waktu_keluar },
      {
        where: {
          userId,
          tanggal: date,
        },
      }
    );

    console.log("Absen Pulang:", absen);

    // Mengirimkan respons sukses dengan data absen yang baru diupdate
    res.status(200).json({ msg: "Berhasil Pulang", absen });
  } catch (error) {
    console.error("Error updating absen:", error);
    // Menangani kesalahan dan mengirimkan respons dengan status 500
    res.status(500).json({ msg: error.message });
  }
};

export const GeoLocation = async (req, res) => {
  const { userId } = req.body;

  console.log("Request received to update absen for userId:", userId);
  const { lat, long } = req.body;

  // Mendapatkan tanggal dan waktu saat ini
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_datang = today.toLocaleTimeString("en-GB"); // Menggunakan en-GB untuk format 24 jam

  try {
    const absen = await Absen.create(
      {
        userId,
        tanggal: date,
        lat: lat,
        long: long,
        waktu_datang,
        keterangan: "Hadir",
      },
      {
        where: {
          userId,
          tanggal: date,
        },
      }
    );
    console.log("Absen Geolocation:", absen);
    res.status(200).json({ msg: "Berhasil Update Geolocation", absen });
  } catch (error) {
    console.error("Error updating absen:", error);
    res.status(500).json({ msg: error.message });
  }
};
