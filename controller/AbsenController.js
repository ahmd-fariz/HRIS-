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
      attributes: ["userId", "tanggal", "waktu_datang", "keterangan"],
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

  console.log("Request received to create absen for userId:", userId);

  // Mendapatkan tanggal dan waktu saat ini
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_datang = today.toLocaleTimeString(); // Mendapatkan waktu saat ini dalam format jam:menit:detik AM/PM

  try {
    // Membuat data absen baru di database
    const absen = await Absen.create({
      userId,
      tanggal: date,
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
