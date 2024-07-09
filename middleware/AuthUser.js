import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon Login Ke Akun Anda" });
  }
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const Role = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Di Temukan" });
  if (user.role !== "Manager" && user.role !== "Karyawan")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};
