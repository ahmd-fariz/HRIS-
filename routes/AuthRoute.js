import express from "express";
import { Login, Logout, Me } from "../controller/AuthController.js";

const router = express.Router();

router.post("/login", Login);
router.get("/me", Me);
router.delete("/logout", Logout);

export default router;
