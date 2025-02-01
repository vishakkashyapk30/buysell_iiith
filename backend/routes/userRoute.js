import express from "express";
import { loginUser, registerUser, updateProfile, logoutUser, getUserItems, casCallback } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateCaptcha } from "../middleware/captcha.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", validateCaptcha, loginUser);
router.get("/cas/callback", casCallback);
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logoutUser);
router.get("/items", protect, getUserItems);

export default router;
