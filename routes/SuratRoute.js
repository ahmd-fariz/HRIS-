import express from "express";
import { 
    createSurat, 
    getSurats, 
    getSuratById, 
    updateSurat 
} from "../controller/SuratController.js";

const router = express.Router();

// Rute untuk mendapatkan semua surat
router.get("/surats", getSurats);

// Rute untuk membuat surat baru
router.post("/surats", createSurat);

// Rute untuk mendapatkan surat berdasarkan ID
router.get("/surats/:id", getSuratById);

// Rute untuk memperbarui surat
router.patch("/surats/:id", updateSurat);

export default router;