import { Sequelize } from "sequelize";

const db = new Sequelize("hairis", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
// Halo, ini commit poras

export default db;
