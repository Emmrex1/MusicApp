import type { Request } from "express";
import TryCatch from "../TryCatch.js";
import getBuffer from "../config/dataUri.js";
import { sql } from "../config/db.js";
import cloudinary from "cloudinary";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No file to upload",
    });
  }

  // Convert file to DataURI
  const fileBuffer = getBuffer(file);
  if (!fileBuffer) {
    return res.status(400).json({
      success: false,
      message: "Invalid file format or empty buffer",
    });
  }

   // Upload to Cloudinary
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer, {
    folder: "albums",
    resource_type: "image", 
  });

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${cloud.secure_url})
    RETURNING *;
  `;

  res.status(201).json({
    success: true,
    message: "Album created successfully",
    album: result[0],
  });
});
