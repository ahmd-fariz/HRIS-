import express from "express";
import { getSettings, getSettingById, updateSetting } from "../controller/SettingController.js";

const router = express.Router();

router.get("/settings", getSettings);
router.get("/settings/:id", getSettingById);
router.patch("/settings/:id", updateSetting);

export default router;
