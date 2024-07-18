import express from "express";
import {
  GetAbsens,
  createAbsen,
} from "../controller/AbsenController.js";

const router = express.Router();

router.get("/absens", GetAbsens);
router.get("/absen", createAbsen);

export default router;
