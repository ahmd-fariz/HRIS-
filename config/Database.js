import { Sequelize } from "sequelize";

const db = new Sequelize("u610515881_hris", "u610515881_hris", "HrisGMT@1", {
  host: "153.92.15.8",
  port: "3306",
  dialect: "mysql",
});

export default db;
