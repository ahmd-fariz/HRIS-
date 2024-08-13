import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Alpha dengan id sebagai primary key
const Alpha = db.define(
  "alpha",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jam_alpha: {
      // Mendefinisikan kolom jam_alpha dengan tipe data TIME dan tidak boleh kosong
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    // Mengatur nama tabel untuk tidak mengubah ke bentuk plural secara otomatis
    freezeTableName: true,
  }
);

export default Alpha;