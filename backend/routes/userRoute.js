import express from "express";
import {
  loginUser,
  registerUser,
  getUserInfo,
  getAllUsers,
  removeUser,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/info", verifyToken, getUserInfo);
router.get("/list", verifyToken, verifyAdmin, getAllUsers);
router.post("/remove", verifyToken, verifyAdmin, removeUser);
router.post("/update", verifyToken, verifyAdmin, updateUser);

export default router;
