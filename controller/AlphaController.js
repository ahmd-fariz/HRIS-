import Alpha from "../models/Alpha.js";

// Fungsi untuk mendapatkan jam alpha
export const getAlpha = async (req, res) => {
  try {
    const alpha = await Alpha.findAll();
    res.status(200).json(alpha);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan jam alpha berdasarkan id
export const getAlphaById = async (req, res) => {
  try {
    const alpha = await Alpha.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!alpha) return res.status(404).json({ msg: "Alpha tidak ditemukan" });
    res.status(200).json(alpha);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mengupdate jam alpha
export const updateAlpha = async (req, res) => {
  const { jam_alpha } = req.body;
  try {
    const alpha = await Alpha.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!alpha) return res.status(404).json({ msg: "Alpha tidak ditemukan" });

    alpha.jam_alpha = jam_alpha;
    await alpha.save();

    res.status(200).json({ msg: "Alpha berhasil diupdate", alpha });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
