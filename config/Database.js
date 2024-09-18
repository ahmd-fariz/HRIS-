import { Sequelize } from "sequelize";

const db = new Sequelize("hairis", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
