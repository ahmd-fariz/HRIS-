import Absen from "../models/Absen.js";

export const GetAbsens = async (req, res) => {};

export const createAbsen = async (req, res) => {
  const { userId } = req.body;

  console.log("Request received to create absen for userId:", userId);
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_datang = today.toLocaleTimeString();
  try {
    const absen = await Absen.create({
      userId,
      tanggal: date,
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
