import Role from "../models/Role.js";

// Fungsi untuk mendapatkan semua role
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan role berdasarkan id
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!role) return res.status(404).json({ msg: "Role tidak ditemukan" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk membuat role baru
export const createRole = async (req, res) => {
  const { nama_role, jam_pulang, denda_telat } = req.body;
  try {
    const newRole = await Role.create({
      nama_role,
      jam_pulang,
      denda_telat,
    });
    res.status(201).json({ msg: "Role berhasil dibuat", newRole });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mengupdate role
export const updateRole = async (req, res) => {
  const { nama_role, jam_pulang, denda_telat } = req.body;
  try {
    const role = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!role) return res.status(404).json({ msg: "Role tidak ditemukan" });

    role.nama_role = nama_role;
    role.jam_pulang = jam_pulang;
    role.denda_telat = denda_telat;
    await role.save();

    res.status(200).json({ msg: "Role berhasil diupdate", role });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk menghapus role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!role) return res.status(404).json({ msg: "Role tidak ditemukan" });

    await role.destroy();
    res.status(200).json({ msg: "Role berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
