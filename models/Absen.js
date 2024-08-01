import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserModel from "../models/UserModel.js";

const { DataTypes } = Sequelize;

const Absen = db.define(
  "absen",
  {
    id: {
      // Mendefinisikan kolom id sebagai primary key dan auto-increment
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    waktu_datang: {
      type: DataTypes.TIME,
      allowNull: false,
     // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    waktu_keluar: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Input foto, besok ajalah
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url_foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.ENUM('Hadir', 'Izin', 'Sakit', 'Alpha'),
      allowNull: false,
      defaultValue: 'Hadir',
    },
    alasan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

UserModel.hasMany(Absen, { foreignKey: 'userId' });
Absen.belongsTo(UserModel, { foreignKey: 'userId' });

export default Absen;
