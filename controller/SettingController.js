import path from "path";
import fs from "fs";
import Setting from "../models/Setting.js";

export const updateSetting = async (req, res) => {
  const {
    nama_perusahaan,
    warna_primary,
    warna_secondary,
    warna_sidebar,
    kop_surat_1,
    kop_surat_2,
    kop_surat_3
  } = req.body;
  let fileName;
  let signatureFile; // Deklarasikan signatureFile

  try {
    const setting = await Setting.findOne({
      where: { id: req.params.id },
    });

    if (!setting)
      return res.status(404).json({ msg: "Setting tidak ditemukan" });

    // Update colors if provided
    if (warna_primary || warna_secondary || warna_sidebar) {
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
    }

    // Handle file upload and letter components update
    if (req.files && req.files.logo) {
      const file = req.files.logo;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const uploadPath = `./public/logo/${fileName}`;

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
        const oldFilePath = `./public/logo/${setting.logo}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      await file.mv(uploadPath);
    } else {
      fileName = setting.logo; // Keep old logo if no new logo is uploaded
    }

    const url = `${req.protocol}://${req.get("host")}/logo/${fileName}`;

    // Handle file upload and letter components update
    if (req.files && req.files.signature) {
      const file = req.files.signature;
      const ext = path.extname(file.name);
      signatureFile = file.md5 + ext;
      const uploadPath = `./public/signature/${signatureFile}`;

      // Validate file type and size
      const allowedType = [".png"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Must png" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // Delete old file if exists for signature
      if (setting.signature) { // Ganti setting.logo dengan setting.signature
        const oldFilePath = `./public/signature/${setting.signature}`; // Ganti logo dengan signature
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      await file.mv(uploadPath);
    } else {
      signatureFile = setting.signature; // Keep old signature if no new signature is uploaded
    }

    const url_signature = `${req.protocol}://${req.get("host")}/signature/${signatureFile}`;


    // Update company name and letter components
    await Setting.update(
      {
        nama_perusahaan: nama_perusahaan || setting.nama_perusahaan,
        logo: fileName,
        url: url,
        signature: signatureFile,
        url_signature: url_signature,
        kop_surat_1: kop_surat_1 || setting.kop_surat_1,
        kop_surat_2: kop_surat_2 || setting.kop_surat_2,
        kop_surat_3: kop_surat_3 || setting.kop_surat_3,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

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
    if (!setting)
      return res.status(404).json({ msg: "Setting tidak ditemukan" });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};