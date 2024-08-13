import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model HariLibur dengan id sebagai primary key
const HariLibur = db.define(
  "hari_libur",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_libur: {
      // Mendefinisikan kolom nama_libur
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_hari_libur: {
      // Mendefinisikan kolom tanggal_hari_libur dengan tipe data DATEONLY
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    // Mengatur nama tabel untuk tidak mengubah ke bentuk plural secara otomatis
    freezeTableName: true,
  }
);

// Menambahkan getter untuk mendapatkan format MM-DD
HariLibur.prototype.getTanggalBulan = function() {
  const date = new Date(this.tanggal_hari_libur);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};

export default HariLibur;