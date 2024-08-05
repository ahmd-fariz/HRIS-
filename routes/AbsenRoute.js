import express from "express";
import {
  GetAbsens,
  createAbsen,
  AbsenKeluar,
  GeoLocation,
} from "../controller/AbsenController.js";
import { verifyUser, Role } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/absens", verifyUser, Role, GetAbsens);
router.post("/absen", createAbsen);
router.patch("/absen/:id", AbsenKeluar);
router.post("/absen/geolocation", GeoLocation);

export default router;
