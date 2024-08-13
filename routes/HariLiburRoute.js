import express from "express";
import {
  getHariLibur,
  getHariLiburById,
  createHariLibur,
  updateHariLibur,
  deleteHariLibur
} from "../controller/HariLiburController.js";

const router = express.Router();

// Route untuk mendapatkan semua hari libur
router.get("/hari-libur", getHariLibur);

// Route untuk mendapatkan hari libur berdasarkan id
router.get("/hari-libur/:id", getHariLiburById);

// Route untuk membuat hari libur baru
router.post("/hari-libur", createHariLibur);

// Route untuk mengupdate hari libur
router.patch("/hari-libur/:id", updateHariLibur);

// Route untuk menghapus hari libur
router.delete("/hari-libur/:id", deleteHariLibur);

export default router;