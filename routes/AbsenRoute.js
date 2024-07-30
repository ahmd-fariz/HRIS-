import express from "express";
import {
  GetAbsens,
  createAbsen,
  AbsenKeluar,
} from "../controller/AbsenController.js";

const router = express.Router();

router.get("/absens", GetAbsens);
router.post("/absen", createAbsen);
router.patch("/absen/:id", AbsenKeluar);

export default router;
