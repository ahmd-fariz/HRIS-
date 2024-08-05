import express from "express";
import { getSettings, createSetting, updateSetting, deleteSetting } from "../controller/SettingController.js";

const router = express.Router();

router.get("/settings", getSettings);
router.post("/settings", createSetting);
router.patch("/settings/:id", updateSetting);
router.delete("/settings/:id", deleteSetting);

export default router;
