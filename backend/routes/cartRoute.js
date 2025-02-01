import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToCart, getCart } from "../controllers/cartController.js";
import { removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete('/remove/:itemId', protect, removeFromCart);

export default router;
