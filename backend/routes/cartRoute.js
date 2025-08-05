import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", verifyToken, addToCart);
cartRouter.post("/remove", verifyToken, removeFromCart);
cartRouter.post("/get", verifyToken, getCart);

export default cartRouter;
