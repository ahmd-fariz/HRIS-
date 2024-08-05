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

router.get("/users", verifyUser, Role, GetUsers);
router.get("/userfotoabsen", verifyUser, Role, GetUserFotoAbsen);
router.get("/users/:id", verifyUser, Role, GetUsersById);
router.patch("/userfotoprofile/:id", verifyUser, Role, UpdatePotoProfile);
//router.get("/userbyrole/:role", verifyUser, Role, GetUsersById);
// router.get("/userbyrole/:role", verifyUser, Role, GetUsersByRole);
router.get("/userbyrole/:roleId", verifyUser, Role, GetUsersByRole);
// router.post("/users", Role, CreateUser);
router.post("/users", verifyUser, Role, CreateUser);
router.patch("/userAbsen/:id", verifyUser, Role, UpdateForFotoAbsen);
router.patch("/updateuser/:id", verifyUser, Role, UpdateUser);
router.delete("/users/:id", verifyUser, Role, DeleteUser);

export default router;
