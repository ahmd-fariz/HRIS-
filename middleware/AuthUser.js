import Users from "../models/UserModel.js";

// Middleware untuk memverifikasi apakah pengguna sudah login
export const verifyUser = async (req, res, next) => {
  // Memeriksa apakah userId ada dalam sesi
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon Login Ke Akun Anda" });
  }

  try {
    // Mencari pengguna berdasarkan id yang disimpan di sesi
    const user = await Users.findOne({
      where: {
        id: req.session.userId,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });

    // Menyimpan id pengguna dan role ke dalam request object
    req.userId = user.id;
    req.role = user.role;

    // Melanjutkan ke middleware atau route handler berikutnya
    next();
  } catch (error) {
    // Menangani kesalahan dan mengirim respons dengan status 500
    console.error("Error verifying user:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Middleware untuk memeriksa role pengguna
export const Role = async (req, res, next) => {
  try {
    // Mencari pengguna berdasarkan id yang disimpan di sesi
    const user = await Users.findOne({
      where: {
        id: req.session.userId,
      },
    });

    // Jika pengguna tidak ditemukan, kirim respons dengan status 404
    if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });

    // Memeriksa apakah role pengguna adalah "Manager" atau "Karyawan"
    if (user.role !== "Manager" && user.role !== "Karyawan")
      return res.status(403).json({ msg: "Akses terlarang" });

    // Melanjutkan ke middleware atau route handler berikutnya
    next();
  } catch (error) {
    // Menangani kesalahan dan mengirim respons dengan status 500
    console.error("Error checking role:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
