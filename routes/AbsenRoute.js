import express from "express";
import {
  GetAbsens,
  createAbsen,
  AbsenKeluar,
  GeoLocation,
  CheckUserAbsenStatus,
} from "../controller/AbsenController.js";

const router = express.Router();

router.get("/absens", GetAbsens);
router.get("/cek/absen/:userid/:id", CheckUserAbsenStatus);
router.post("/absen", createAbsen);
router.patch("/absen/:id", AbsenKeluar);
router.post("/absen/geolocation", GeoLocation);

export default router;