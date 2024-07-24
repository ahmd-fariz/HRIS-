import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Users dengan id sebagai primary key
const Users = db.define(
  "users",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      // Mendefinisikan kolom name dengan validasi tidak boleh kosong dan panjang antara 3 hingga 100 karakter
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    email: {
      // Mendefinisikan kolom email dengan validasi tidak boleh kosong dan harus berupa format email yang valid
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      // Mendefinisikan kolom password dengan validasi tidak boleh kosong
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      // Mendefinisikan kolom role dengan validasi tidak boleh kosong
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      // Mendefinisikan kolom image tanpa validasi tambahan
      type: DataTypes.STRING,
    },
    url: {
      // Mendefinisikan kolom url tanpa validasi tambahan
      type: DataTypes.STRING,
    },
    foto_absen: {
      // Mendefinisikan kolom foto_absen dengan allowNull true
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_foto_absen: {
      // Mendefinisikan kolom url_foto_absen dengan allowNull true
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Mengatur nama tabel untuk tidak mengubah ke bentuk plural secara otomatis
    freezeTableName: true,
  }
);

export default Users;
