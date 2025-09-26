import type { Request } from "express";
import TryCatch from "../TryCatch.js";
import getBuffer from "../config/dataUri.js";
import { sql } from "../config/db.js";
import cloudinary from "cloudinary";
import { redisClient } from "../index.js";

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

  if(redisClient.isOpen){
    await redisClient.del("albums");
    console.log("🗑️  Albums cache cleared or invalidated in Redis");
  }

  res.status(201).json({
    success: true,
    message: "Album created successfully",
    album: result[0],
  });
});

export const addsong = TryCatch(async (req: AuthenticatedRequest, res) => {
   if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { title, description, album } = req.body;
  if (!title || !description || !album) {
    return res.status(400).json({
      success: false,
      message: "Title, description, and album ID are required",
    });
  }
  const isAlbum = await sql` SELECT * FROM albums WHERE id = ${album}; `;

  if (isAlbum.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Album not found with the provided ID",
    });
  }

  const file = req.file;
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
    folder: "songs",
    resource_type: "auto", 
  });
  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id)
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${album})
    RETURNING *;
  `;
  if(redisClient.isOpen){
    await redisClient.del("songs");
    console.log("🗑️  Songs cache cleared or invalidated in Redis ");
  }
   res.status(201).json({
     message: "Song added successfully" 

   })
});

export const addthumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
   if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }
  const song = await sql` SELECT * FROM songs WHERE id = ${req.params.id}; `;
  if (song.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Song not found with the provided ID",
    });
  }
  const file = req.file;
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
    folder: "songs",
    resource_type: "image",
  });
  const result = await sql`
    UPDATE songs
    SET thumbnail = ${cloud.secure_url}
    WHERE id = ${req.params.id}
    RETURNING *;
  `;
  if(redisClient.isOpen){
    await redisClient.del("songs");
    console.log("🗑️  Songs cache cleared or invalidated in Redis ");
  }
   res.status(200).json({
     message: "Thumbnail added successfully",
     song: result[0],
   });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
   if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }
  const { id } = req.params;
  const album = await sql` SELECT * FROM albums WHERE id = ${id}; `;
  if (album.length === 0) {
    return res.status(404).json({
       message: "Album not found with the provided ID" });
  }
   await sql` DELETE FROM songs WHERE album_id = ${id}; `;
    await sql` DELETE FROM albums WHERE id = ${id}; `;
    if(redisClient.isOpen){
      await redisClient.del("albums");
      await redisClient.del("songs");
      console.log("🗑️  Albums and Songs cache cleared or invalidated in Redis ");
    }
    res.status(200).json({ 
      message: "Album and associated songs deleted successfully"
    });
 
});

export const deletesong = TryCatch(async (req: AuthenticatedRequest, res) => {
   if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }
  const { id } = req.params;
  const song = await sql` SELECT * FROM songs WHERE id = ${id}; `;
  
    if(redisClient.isOpen){
      await redisClient.del("albums");
      console.log("🗑️  Albums cache cleared or invalidated in Redis ");
    }

  if (song.length === 0) {
    return res.status(404).json({
       message: "Song not found with the provided ID" });
  }
    await sql` DELETE FROM songs WHERE id = ${id}; `;
    
    if(redisClient.isOpen){
      await redisClient.del("songs");
      console.log("🗑️  Songs cache cleared or invalidated in Redis ");
    }
    res.status(200).json({ message: "Song deleted successfully" });
});