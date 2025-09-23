
import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  playlist: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(403).json({ message: "No token provided, please login" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const { data } = await axios.get(`${process.env.User_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    req.user = data.user;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token, please login" });
  }
};



  
