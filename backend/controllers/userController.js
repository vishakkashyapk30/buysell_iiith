import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import { validateCASTicket } from '../middleware/casMiddleware.js';
import { CAS_CONFIG } from '../config/cas.config.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: createToken(user._id),
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  const { firstName, lastName, email, age, contactNumber, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: createToken(user._id),
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNumber, password } =
      req.body;
    const userId = req.user._id;

    if (!firstName || !lastName || !email || !age || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields except password are required",
      });
    }

    const updates = {
      firstName,
      lastName,
      email,
      age: Number(age),
      contactNumber,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserItems = async (req, res) => {
  try {
    console.log("Fetching items for user:", req.user._id);

    const items = await Item.find({ sellerId: req.user._id })
      .populate("sellerId", "firstName lastName email")
      .sort({ createdAt: -1 });

    console.log("Found items:", items);

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("getUserItems error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching user items",
    });
  }
};

const casCallback = async (req, res) => {
  try {
      const { ticket } = req.query;
      const userInfo = await validateCASTicket(ticket);
      
      let user = await User.findOne({ email: userInfo.email });
      
      if (!user) {
          // Redirect to signin with user info for first-time users
          const queryParams = new URLSearchParams({
              email: userInfo.email,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              casLogin: 'true'
          });
          return res.redirect(`${CAS_CONFIG.FRONTEND_URL}/signin?${queryParams.toString()}`);
      }
      
      // Existing user - create token and redirect to login
      const token = createToken(user._id);
      res.redirect(`${CAS_CONFIG.FRONTEND_URL}/login?token=${token}&casLogin=true`);
      
  } catch (error) {
      console.error('CAS callback error:', error);
      res.redirect(`${CAS_CONFIG.FRONTEND_URL}/login?error=cas_failed`);
  }
};

export { loginUser, registerUser, updateProfile, logoutUser, getUserItems, casCallback };
