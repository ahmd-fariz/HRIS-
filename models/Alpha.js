import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Users dengan id sebagai primary key
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
      // Mendefinisikan kolom name dengan validasi tidak boleh kosong dan panjang antara 3 hingga 100 karakter
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
