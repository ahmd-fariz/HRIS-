import express from "express";
import {
  getAlpha,
  getAlphaById,
  updateAlpha,
} from "../controller/AlphaController.js";

const router = express.Router();

router.get("/alpha", getAlpha);
router.get("/alpha/:id", getAlphaById);
router.patch("/alpha/:id", updateAlpha);

export default router;
