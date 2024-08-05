import express from "express";
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from "../controller/RoleController.js";
import { verifyUser, Role } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/roles", verifyUser, Role, getRoles);
router.get("/roles/:id", verifyUser, Role, getRoleById);
router.post("/roles", verifyUser, Role, createRole);
router.patch("/roles/:id", verifyUser, Role, updateRole);
router.delete("/roles/:id", verifyUser, Role, deleteRole);

export default router;
