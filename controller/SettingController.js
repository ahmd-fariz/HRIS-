import Setting from "../models/Setting.js";

// Fungsi untuk membuat setting apabila setting tidak ada isinya
export const createSetting = async (req, res) => {
  try {
    console.log("Received body:", req.body);

    const {
      warna_primary,
      warna_secondary,
      warna_sidebar
    } = req.body;

    if (!warna_primary || !warna_secondary || !warna_sidebar) {
      return res.status(400).json({ 
        msg: "Warna primary, warna secondary, dan warna sidebar harus diisi",
        received: { warna_primary, warna_secondary, warna_sidebar }
      });
    }
    
    const newSetting = await Setting.create({
      warna_primary,
      warna_secondary,
      warna_sidebar
    });
    
    res.status(201).json({ 
      msg: "Setting berhasil dibuat", 
      setting: newSetting
    });
  } catch (error) {
    console.error("Error in createSetting:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateSetting = async (req, res) => {
  const {
    warna_primary,
    warna_secondary,
    warna_sidebar
  } = req.body;

  try {
    const setting = await Setting.findOne({
      where: { id: req.params.id },
    });

    if (!setting)
      return res.status(404).json({ msg: "Setting tidak ditemukan" });

    await Setting.update(
      {
        warna_primary: warna_primary || setting.warna_primary,
        warna_secondary: warna_secondary || setting.warna_secondary,
        warna_sidebar: warna_sidebar || setting.warna_sidebar,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Setting berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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
    if (!setting)
      return res.status(404).json({ msg: "Setting tidak ditemukan" });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};