import Absen from "../models/Absen.js";

export const GetAbsens = async (req, res) => {};

export const createAbsen = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newAbsen = await Absen.create({
      userId,
      tanggal: new Date(), // Tanggal hari ini
      waktuDatang: new Date(), // Waktu datang saat ini
      keterangan: "Hadir",
    });

    res.status(201).json(newAbsen);
  } catch (error) {
    console.error("Error creating absen:", error);
    res.status(500).json({ error: "An error occurred while creating absen" });
  }
};
