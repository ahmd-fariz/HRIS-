import express from "express";
import {
  CreateUser,
  DeleteUser,
  GetUserFotoAbsen,
  GetUsers,
  GetUsersById,
  GetUsersByRole,
  UpdateForFotoAbsen,
  UpdatePotoProfile,
  UpdateUser,
} from "../controller/UserController.js";
import { verifyUser, Role } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", GetUsers);
router.get("/userfotoabsen", GetUserFotoAbsen);
router.get("/users/:id", GetUsersById);
router.patch("/userfotoprofile/:id", UpdatePotoProfile);
//router.get("/userbyrole/:role", verifyUser, Role, GetUsersById);
// router.get("/userbyrole/:role", verifyUser, Role, GetUsersByRole);
router.get("/userbyrole/:role", GetUsersByRole);
// router.post("/users", Role, CreateUser);
router.post("/users", CreateUser);
router.patch("/userAbsen/:id", UpdateForFotoAbsen);
router.patch("/updateuser/:id", UpdateUser);
router.delete("/users/:id", DeleteUser);

export default router;
