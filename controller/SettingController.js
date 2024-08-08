import path from "path";
import fs from "fs";
import Setting from "../models/Setting.js";

export const updateSetting = async (req, res) => {
  const { nama_perusahaan, warna_primary, warna_secondary, warna_sidebar } = req.body;
  let fileName;
  
  try {
    const setting = await Setting.findOne({
      where: { id: req.params.id },
    });
    
    if (!setting) return res.status(404).json({ msg: "Setting tidak ditemukan" });

    if (req.files && req.files.logo) {
      const file = req.files.logo;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const uploadPath = `./public/images/${fileName}`;
      
      // Validate file type and size
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // Delete old file if exists
      if (setting.logo) {
        const oldFilePath = `./public/images/${setting.logo}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      file.mv(uploadPath, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    } else {
      fileName = setting.logo; // Keep old logo if no new logo is uploaded
    }

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    setting.nama_perusahaan = nama_perusahaan;
    setting.warna_primary = warna_primary;
    setting.warna_secondary = warna_secondary;
    setting.warna_sidebar = warna_sidebar;
    setting.logo = fileName;
    setting.url = url;

    await setting.save();

    res.status(200).json({ msg: "Setting berhasil diupdate", setting });
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
    if (!setting) return res.status(404).json({ msg: "Setting tidak ditemukan" });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
