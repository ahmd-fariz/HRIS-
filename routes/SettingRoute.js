import express from "express";
import { createSetting, getSettings, getSettingById, updateSetting } from "../controller/SettingController.js";

const router = express.Router();

router.get("/settings", getSettings);
router.post("/settings", createSetting);
router.get("/settings/:id", getSettingById);
router.patch("/settings/:id", updateSetting);

export default router;
