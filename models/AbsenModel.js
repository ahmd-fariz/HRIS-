import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import UserModel from "../models/UserModel.js";

const { DataTypes } = Sequelize;

const Absen = db.define(
  "absen",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    waktu_datang: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    waktu_keluar: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail_alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

UserModel.hasMany(Absen);
Absen.belongsTo(UserModel);

export default Absen;
