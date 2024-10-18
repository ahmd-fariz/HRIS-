// import { API_Frontend } from "./api/api.js";
import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import db from "./config/Database.js";
import FileUpload from "express-fileupload";
// import session from "express-session";
// import SequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";

// Bagian route
import AbsenRoute from "./routes/AbsenRoute.js";
import AlphaRoute from "./routes/AlphaRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import HariLiburRoute from "./routes/HariLiburRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import SettingRoute from "./routes/SettingRoute.js";
import SuratRoute from "./routes/SuratRoute.js";
import UserRoute from "./routes/UserRoute.js";

const app = express(); // Membuat aplikasi Express

// Konfigurasi middleware CORS
const corsOptions = {
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Tambahkan metode yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Tambahkan header yang diizinkan
};

app.use(cors(corsOptions)); // Pastikan ini diterapkan sebelum rute lainnya

app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: true }));
app.use(FileUpload()); // Middleware untuk menangani upload file
// Simpen dulu barkal kepake
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Menyajikan file statis dari folder 'public'
app.use(express.static("public"));
app.use(express.static("public/absen"));
app.use(express.static("public/geolocation"));
app.use(express.static("public/images"));
app.use(express.static("public/logo"));
app.use(express.static("public/signature"));

// Menggunakan route handler untuk berbagai rute
app.use(AbsenRoute); // Rute untuk absensi
app.use(AlphaRoute); // Rute untuk alpha
app.use(AuthRoute); // Rute untuk autentikasi
app.use(HariLiburRoute); // Rute untuk hari libur
app.use(RoleRoute); // Rute untuk role
app.use(SettingRoute); // Rute untuk setting
app.use(SuratRoute); // Rute untuk surat
app.use(UserRoute); // Rute untuk pengguna

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Hris Gmt application." });
});

dotenv.config(); // Memuat variabel lingkungan dari file .env

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
  
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Simpen dulu barkal kepake
// const sessionStore = SequelizeStore(session.Store); // Mengonfigurasi session store untuk Sequelize

// const store = new sessionStore({
//   db: db, // Menghubungkan session store dengan database
// });

// (async () => {
//   await db.sync();
// })();

// Simpen dulu barkal kepake
// Konfigurasi middleware session
// app.use(
//   session({
//     secret: process.env.SESS_SECRET, // Kunci rahasia untuk enkripsi sesi
//     resave: false, // Tidak menyimpan ulang sesi yang tidak berubah
//     saveUninitialized: true, // Menyimpan sesi baru yang belum diinisialisasi
//     store: store, // Menyimpan sesi di database menggunakan Sequelize store
//     cookie: {
//       secure: "auto", // Mengatur cookie agar hanya dikirim melalui HTTPS (otomatis tergantung pada lingkungan)
//     },
//   })
// );
