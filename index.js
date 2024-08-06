import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/Database.js";
import FileUpload from "express-fileupload";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AbsenRoute from "./routes/AbsenRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SettingRoute from "./routes/SettingRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import dotenv from "dotenv";
dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express(); // Membuat aplikasi Express

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const sessionStore = SequelizeStore(session.Store); // Mengonfigurasi session store untuk Sequelize

const store = new sessionStore({
  db: db, // Menghubungkan session store dengan database
});

(async () => {
  await db.sync();
})();

// Konfigurasi middleware session
app.use(
  session({
    secret: process.env.SESS_SECRET, // Kunci rahasia untuk enkripsi sesi
    resave: false, // Tidak menyimpan ulang sesi yang tidak berubah
    saveUninitialized: true, // Menyimpan sesi baru yang belum diinisialisasi
    store: store, // Menyimpan sesi di database menggunakan Sequelize store
    cookie: {
      secure: "auto", // Mengatur cookie agar hanya dikirim melalui HTTPS (otomatis tergantung pada lingkungan)
    },
  })
);
// Konfigurasi middleware CORS
app.use(
  cors({
    credentials: true, // Mengizinkan pengiriman kredensial seperti cookie
    origin: ["http://localhost:3000", "http://192.168.30.15:3000"], // Mengizinkan akses dari kedua origin ini
  })
);

app.use(express.json()); // Middleware untuk parsing JSON
app.use(FileUpload()); // Middleware untuk menangani upload file
app.use(express.static("public")); // Menyajikan file statis dari folder 'public'
app.use(express.static("public/absen")); // Menyajikan file statis dari folder 'public/absen'
app.use(express.static("public/geolocation")); // Menyajikan file statis dari folder 'public/absen'


// Menggunakan route handler untuk berbagai rute
app.use(UserRoute); // Rute untuk pengguna
app.use(AbsenRoute); // Rute untuk absensi
app.use(AuthRoute); // Rute untuk autentikasi
app.use(SettingRoute); // Rute untuk setting
app.use(RoleRoute); // Rute untuk role

store.sync(); // Menyinkronkan tabel session dengan database

app.listen(process.env.APP_PORT, "0.0.0.0", () => {
  console.log("Server up and Running...."); // Menjalankan server pada port yang ditentukan
});
