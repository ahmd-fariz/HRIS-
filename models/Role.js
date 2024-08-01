import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Users dengan id sebagai primary key
const Role = db.define(
  "role",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_role: {
      // Mendefinisikan kolom name dengan validasi tidak boleh kosong dan panjang antara 3 hingga 100 karakter
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    jam_pulang: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    denda_telat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    // Mengatur nama tabel untuk tidak mengubah ke bentuk plural secara otomatis
    freezeTableName: true,
  }
);

export default Role;
