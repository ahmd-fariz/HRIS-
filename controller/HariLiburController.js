import HariLibur from "../models/HariLibur.js";

// Fungsi untuk mendapatkan semua hari libur
export const getHariLibur = async (req, res) => {
  try {
    const hariLibur = await HariLibur.findAll();
    const formattedHariLibur = hariLibur.map(hl => ({
      id: hl.id,
      nama_libur: hl.nama_libur,
      tanggal_hari_libur: hl.tanggal_hari_libur,
    }));
    res.status(200).json(formattedHariLibur);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan hari libur berdasarkan id
export const getHariLiburById = async (req, res) => {
  try {
    const hariLibur = await HariLibur.findOne({
      where: { id: req.params.id }
    });
    if (!hariLibur) return res.status(404).json({ msg: "Hari libur tidak ditemukan" });
    res.status(200).json({
      id: hariLibur.id,
      nama_libur: hariLibur.nama_libur,
      tanggal_hari_libur: hariLibur.tanggal_hari_libur,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat hari libur baru
export const createHariLibur = async (req, res) => {
  try {
    console.log("Received body:", req.body); // Logging untuk debugging

    const nama_libur = req.body.nama_libur;
    const tanggal_hari_libur = req.body.tanggal_hari_libur;

    if (!nama_libur || !tanggal_hari_libur) {
      return res.status(400).json({ 
        msg: "Nama libur dan tanggal harus diisi",
        received: { nama_libur, tanggal_hari_libur }
      });
    }
    
    const newHariLibur = await HariLibur.create({
      nama_libur,
      tanggal_hari_libur,
    });
    
    res.status(201).json({ 
      msg: "Hari libur berhasil dibuat", 
      hariLibur: {
        id: newHariLibur.id,
        nama_libur: newHariLibur.nama_libur,
        tanggal_hari_libur: newHariLibur.tanggal_hari_libur,
      }
    });
  } catch (error) {
    console.error("Error in createHariLibur:", error); // Logging untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mengupdate hari libur
export const updateHariLibur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_libur, tanggal_hari_libur } = req.body;

    const hariLibur = await HariLibur.findByPk(id);

    if (!hariLibur) {
      return res.status(404).json({ msg: "Hari libur tidak ditemukan" });
    }

    if (nama_libur && tanggal_hari_libur) {
      hariLibur.nama_libur = nama_libur;
      hariLibur.tanggal_hari_libur = tanggal_hari_libur;
    }

    await hariLibur.save();

    res.status(200).json({ 
      msg: "Hari libur berhasil diupdate", 
      hariLibur: {
        id: hariLibur.id,
        nama_libur: hariLibur.nama_libur,
        tanggal_hari_libur: hariLibur.tanggal_hari_libur,
      }
    });
  } catch (error) {
    console.error("Error in updateHariLibur:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk menghapus hari libur
export const deleteHariLibur = async (req, res) => {
  try {
    const hariLibur = await HariLibur.findOne({
      where: { id: req.params.id }
    });
    if (!hariLibur) return res.status(404).json({ msg: "Hari libur tidak ditemukan" });

    await hariLibur.destroy();
    res.status(200).json({ msg: "Hari libur berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};