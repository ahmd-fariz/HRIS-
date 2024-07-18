import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";

export const GetAbsens = async (req, res) => {
  try {
    const response = await Absen.findAll({
      include: {
        model: UserModel,
        attributes: ["name","role"],
      },
      attributes: ["userId", "tanggal", "waktu_datang", "keterangan"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAbsen = async (req, res) => {
  const { userId } = req.body;

  console.log("Request received to create absen for userId:", userId);
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const waktu_datang = today.toLocaleTimeString(); // Mendapatkan Waktu hari ini dalam format am.pm
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
