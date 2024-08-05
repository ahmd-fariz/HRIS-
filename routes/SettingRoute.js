import express from "express";
import { getSettings, createSetting, updateSetting, deleteSetting } from "../controller/SettingController.js";
import { verifyUser, Role } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/settings", verifyUser, Role, getSettings);
router.post("/settings", verifyUser, Role, createSetting);
router.patch("/settings/:id", verifyUser, Role, updateSetting);
router.delete("/settings/:id", verifyUser, Role, deleteSetting);

export default router;
