import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controller/RoleController.js";

const router = express.Router();

router.get("/roles", getRoles);
router.post("/roles", createRole);
router.patch("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

export default router;
