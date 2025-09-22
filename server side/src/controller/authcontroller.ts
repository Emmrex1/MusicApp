
import type { AuthenticatedRequest } from "../middleware/middleware.js";
import User from "../models/model.js"; 
import TryCatch from "../TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUsers = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET is not defined in .env");
//   }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string,{ expiresIn: "1d" });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      playlists: user.playlists,
      timestamp: user.createdAt,
    },
    token, 
  });
});


export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not exit, try again or register",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid password ",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string,{ expiresIn: "1d" });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      playlists: user.playlists,
      timestamp: user.createdAt,
    },
    token,
  });
});

export const getProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});



