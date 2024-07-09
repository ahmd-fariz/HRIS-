import express from "express";
import {
  CreateAbsen,
  DeleteAbsen,
  GetAbsenById,
  GetAbsens,
  UpdateAbsen,
} from "../controller/AbsenController.js";

const router = express.Router();

router.get("/absens", GetAbsens);
router.get("/absens/:id", GetAbsenById);
router.post("/absens", CreateAbsen);
router.patch("/absens/:id", UpdateAbsen);
router.delete("/absens/:id", DeleteAbsen);

export default router;
