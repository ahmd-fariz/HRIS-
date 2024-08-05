import Setting from "../models/Setting.js";

// Fungsi untuk mendapatkan semua setting
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan setting berdasarkan id
export const getSettingById = async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!setting) return res.status(404).json({ msg: "Setting tidak ditemukan" });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat setting baru
export const createSetting = async (req, res) => {
  const { nama_setting, nilai_setting } = req.body;
  try {
    const newSetting = await Setting.create({
      nama_setting,
      nilai_setting,
    });
    res.status(201).json({ msg: "Setting berhasil dibuat", newSetting });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mengupdate setting
export const updateSetting = async (req, res) => {
  const { nama_setting, nilai_setting } = req.body;
  try {
    const setting = await Setting.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!setting) return res.status(404).json({ msg: "Setting tidak ditemukan" });

    setting.nama_setting = nama_setting;
    setting.nilai_setting = nilai_setting;
    await setting.save();

    res.status(200).json({ msg: "Setting berhasil diupdate", setting });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk menghapus setting
export const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!setting) return res.status(404).json({ msg: "Setting tidak ditemukan" });

    await setting.destroy();
    res.status(200).json({ msg: "Setting berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
