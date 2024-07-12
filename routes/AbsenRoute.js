import express from "express";
import {
  GetAbsens,
} from "../controller/AbsenController.js";

const router = express.Router();

router.get("/absens", GetAbsens);

export default router;
