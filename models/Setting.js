import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Users dengan id sebagai primary key
const Setting = db.define(
  "setting",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_perusahaan: {
      // Mendefinisikan kolom name dengan validasi tidak boleh kosong dan panjang antara 3 hingga 100 karakter
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    warna_primary: {
      // Mendefinisikan kolom name dengan validasi tidak boleh kosong dan panjang antara 3 hingga 100 karakter
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    warna_secondary: {
      // Mendefinisikan kolom email dengan validasi tidak boleh kosong dan harus berupa format email yang valid
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    warna_sidebar: {
      // Mendefinisikan kolom password dengan validasi tidak boleh kosong
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    logo: {
      // Mendefinisikan kolom image tanpa validasi tambahan
      type: DataTypes.STRING,
    },
    url: {
      // Mendefinisikan kolom url tanpa validasi tambahan
      type: DataTypes.STRING,
    },

  },
  {
    // Mengatur nama tabel untuk tidak mengubah ke bentuk plural secara otomatis
    freezeTableName: true,
  }
);

export default Setting;
