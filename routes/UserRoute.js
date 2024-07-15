import express from "express";
import {
  CreateUser,
  DeleteUser,
  GetUsers,
  GetUsersById,
  GetUsersByRole,
  UpdateForFotoAbsen,
  UpdateUser,
} from "../controller/UserController.js";
import { verifyUser, Role } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, Role, GetUsers);
router.get("/users/:id", verifyUser, Role, GetUsersById);
//router.get("/userbyrole/:role", verifyUser, Role, GetUsersById);
// router.get("/userbyrole/:role", verifyUser, Role, GetUsersByRole);
router.get("/userbyrole/:role", GetUsersByRole);
// router.post("/users", Role, CreateUser);
router.post("/users", CreateUser);
router.patch("/userAbsen/:id", UpdateForFotoAbsen);
router.patch("/users/:id", verifyUser, Role, UpdateUser);
router.delete("/users/:id", DeleteUser);

export default router;
