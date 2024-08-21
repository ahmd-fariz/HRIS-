import path from "path";
import fs from "fs";
import Surat from "../models/Surat.js";

// Fungsi untuk membuat surat baru
export const createSurat = async (req, res) => {
  try {
    console.log("Received body:", req.body);

    const {
      nama_perusahaan,
      kop_surat,
      alamat,
      alamat_lengkap,
      ketua,
      wakil_ketua
    } = req.body;

    if (!nama_perusahaan || !kop_surat || !alamat || !alamat_lengkap || !ketua || !wakil_ketua) {
      return res.status(400).json({ 
        msg: "Semua field harus diisi",
        received: { nama_perusahaan, kop_surat, alamat, alamat_lengkap, ketua, wakil_ketua }
      });
    }

    let logo = null;
    let url = null;
    let signature = null;
    let url_signature = null;
    let signature_wakil = null;
    let url_signature_wakil = null;

    // Handle file upload for logo
    if (req.files && req.files.logo) {
      const file = req.files.logo;
      const ext = path.extname(file.name);
      logo = file.md5 + ext;
      const uploadPath = `./public/logo/${logo}`;

      // Validate file type and size
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images for logo" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Logo image must be less than 5 MB" });
      }

      // Save new file
      await file.mv(uploadPath);
      url = `${req.protocol}://${req.get("host")}/logo/${logo}`;
    }

    // Handle file upload for signature
    if (req.files && req.files.signature) {
      const file = req.files.signature;
      const ext = path.extname(file.name);
      signature = file.md5 + ext;
      const uploadPath = `./public/signature/${signature}`;

      // Validate file type and size
      const allowedType = [".png"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Signature must be PNG" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Signature image must be less than 5 MB" });
      }

      // Save new file
      await file.mv(uploadPath);
      url_signature = `${req.protocol}://${req.get("host")}/signature/${signature}`;
    }
    
    // Handle file upload for wakil ketua signature
    if (req.files && req.files.signature_wakil) {
      const file = req.files.signature_wakil;
      const ext = path.extname(file.name);
      signature_wakil = file.md5 + ext;
      const uploadPath = `./public/signature/${signature_wakil}`;

      // Validate file type and size
      const allowedType = [".png"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Signature wakil ketua must be PNG" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Signature wakil ketua image must be less than 5 MB" });
      }

      // Save new file
      await file.mv(uploadPath);
      url_signature_wakil = `${req.protocol}://${req.get("host")}/signature/${signature_wakil}`;
    }
    
    const newSurat = await Surat.create({
      nama_perusahaan,
      logo,
      url,
      kop_surat,
      alamat,
      alamat_lengkap,
      ketua,
      signature,
      url_signature,
      wakil_ketua,
      signature_wakil,
      url_signature_wakil
    });
    
    res.status(201).json({ 
      msg: "Surat berhasil dibuat", 
      surat: newSurat
    });
  } catch (error) {
    console.error("Error in createSurat:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateSurat = async (req, res) => {
  const {
    nama_perusahaan,
    kop_surat,
    alamat,
    alamat_lengkap,
    ketua,
    wakil_ketua
  } = req.body;
  let fileName;
  let signatureFile;
  let signatureWakilFile;

  try {
    const surat = await Surat.findOne({
      where: { id: req.params.id },
    });

    if (!surat)
      return res.status(404).json({ msg: "Surat tidak ditemukan" });

    // Handle file upload for logo
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
      if (surat.logo) {
        const oldFilePath = `./public/logo/${surat.logo}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      await file.mv(uploadPath);
    } else {
      fileName = surat.logo; // Keep old logo if no new logo is uploaded
    }

    const url = `${req.protocol}://${req.get("host")}/logo/${fileName}`;

    // Handle file upload for signature
    if (req.files && req.files.signature) {
      const file = req.files.signature;
      const ext = path.extname(file.name);
      signatureFile = file.md5 + ext;
      const uploadPath = `./public/signature/${signatureFile}`;

      // Validate file type and size
      const allowedType = [".png"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Must be PNG" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // Delete old file if exists for signature
      if (surat.signature) {
        const oldFilePath = `./public/signature/${surat.signature}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      await file.mv(uploadPath);
    } else {
      signatureFile = surat.signature; // Keep old signature if no new signature is uploaded
    }

    const url_signature = `${req.protocol}://${req.get("host")}/signature/${signatureFile}`;

    // Handle file upload for wakil ketua signature
    if (req.files && req.files.signature_wakil) {
      const file = req.files.signature_wakil;
      const ext = path.extname(file.name);
      signatureWakilFile = file.md5 + ext;
      const uploadPath = `./public/signature/${signatureWakilFile}`;

      // Validate file type and size
      const allowedType = [".png"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Signature wakil ketua must be PNG" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Signature wakil ketua image must be less than 5 MB" });
      }

      // Delete old file if exists for signature wakil
      if (surat.signature_wakil) {
        const oldFilePath = `./public/signature/${surat.signature_wakil}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      await file.mv(uploadPath);
    } else {
      signatureWakilFile = surat.signature_wakil; // Keep old signature wakil if no new signature is uploaded
    }

    const url_signature_wakil = `${req.protocol}://${req.get("host")}/signature/${signatureWakilFile}`;

    // Update surat
    await Surat.update(
      {
        nama_perusahaan: nama_perusahaan || surat.nama_perusahaan,
        logo: fileName,
        url: url,
        kop_surat: kop_surat || surat.kop_surat,
        alamat: alamat || surat.alamat,
        alamat_lengkap: alamat_lengkap || surat.alamat_lengkap,
        ketua: ketua || surat.ketua,
        signature: signatureFile,
        url_signature: url_signature,
        wakil_ketua: wakil_ketua || surat.wakil_ketua,
        signature_wakil: signatureWakilFile,
        url_signature_wakil: url_signature_wakil,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Surat berhasil diupdate", surat });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan semua surat
export const getSurats = async (req, res) => {
  try {
    const surats = await Surat.findAll();
    res.status(200).json(surats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan surat berdasarkan id
export const getSuratById = async (req, res) => {
  try {
    const surat = await Surat.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!surat)
      return res.status(404).json({ msg: "Surat tidak ditemukan" });
    res.status(200).json(surat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};