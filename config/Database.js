import { Sequelize } from "sequelize";

const db = new Sequelize("hairis", "root", "", {
  host: "153.92.15.8",
  // port: "3306",
  dialect: "mysql",
});

export default db;
