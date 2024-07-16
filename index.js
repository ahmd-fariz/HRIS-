import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import FileUpload from "express-fileupload";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AbsenRoute from "./routes/AbsenRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});
// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(express.static("public/absen"));
app.use(UserRoute);
app.use(AbsenRoute);
app.use(AuthRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and Running....");
});
