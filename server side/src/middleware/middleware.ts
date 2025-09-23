
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IUser } from "../models/model.js";
import User from "../models/model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(403).json({ message: "No token provided, please login" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(403).json({ message: "Token missing, please login" });
      return;
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(403).json({ message: "Invalid token, please login" });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(403).json({ message: "User not found, please login" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token, please login" });
  }
};
