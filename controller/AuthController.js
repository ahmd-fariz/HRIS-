import { json } from "sequelize";
import User from "../models/UserModel.js";
import Role from "../models/Role.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body

    // Mencari pengguna berdasarkan email
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) {
      console.log("User not found"); // Log jika pengguna tidak ditemukan
      return res.status(404).json({ msg: "User Tidak ditemukan" });
    }

    // Memverifikasi password yang diinput dengan password yang ada di database
    const match = await argon2.verify(user.password, req.body.password);

    // Jika password tidak cocok, kirim respons dengan status 400
    if (!match) {
      console.log("Wrong password"); // Log jika password salah
      return res.status(400).json({ msg: "Wrong Password" });
    }

    // Menyimpan id pengguna di sesi
    req.session.userId = user.id;

    // Mencari role berdasarkan roleId pengguna
    const role = await Role.findOne({
      where: {
        id: user.roleId,
      },
    });

    // Mengambil data pengguna untuk dikirim kembali
    const { id, name, email, roleId, image, url } = user;
    const nama_role = role ? role.nama_role : null; // Mendapatkan nama role

    // Mengirim respons sukses dengan data pengguna
    res.status(200).json({ id, name, email, roleId, nama_role, image, url });
  } catch (error) {
    // Menangani kesalahan dan mengirim respons dengan status 500
    console.error("Error logging in:", error); // Log kesalahan
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};


// Fungsi untuk mendapatkan informasi pengguna yang sedang login
export const Me = async (req, res) => {
  // Jika sesi userId tidak ada, kirim respons dengan status 401
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon Login ke Akun Anda" });
  }

  try {
    // Mencari pengguna berdasarkan userId yang disimpan di sesi
    const user = await User.findOne({
      attributes: ["id", "name", "email", "role", "image"],
      where: {
        id: req.session.userId,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) {
      return res.status(404).json({ msg: "User Tidak ditemukan" });
    }

    // Mengirim respons sukses dengan data pengguna
    res.status(200).json(user);
  } catch (error) {
    // Menangani kesalahan dan mengirim respons dengan status 500
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk logout pengguna
export const Logout = (req, res) => {
  // Menghancurkan sesi pengguna
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak Dapat Logout" });

    // Mengirim respons sukses setelah logout
    res.status(200).json({ msg: "Anda Telah Logout" });
  });
};