import Absen from "../models/Absen.js";
import UserModel from "../models/UserModel.js";

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
  const { userId } = req.body;

  console.log("Request received to update absen for userId:", userId);

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const waktu_keluar = today.toLocaleTimeString("en-GB");

  try {
    const absen = await Absen.update(
      { waktu_keluar },
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
  const { userId, lat, long } = req.body;

  console.log("Request received to update absen for userId:", userId);

  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const waktu_datang = today.toLocaleTimeString("en-GB");

  try {
    const absen = await Absen.create(
      {
        userId,
        tanggal: date,
        lat,
        long,
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
