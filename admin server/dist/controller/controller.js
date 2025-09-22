import TryCatch from "../TryCatch.js";
import getBuffer from "../config/dataUri.js";
import { sql } from "../config/db.js";
import cloudinary from "cloudinary";
export const addAlbum = TryCatch(async (req, res) => {
    // 🔒 Check admin role
    if (req.user?.role !== "admin") {
        return res
            .status(403)
            .json({ message: "You are not authorized as admin to perform this action." });
    }
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }
    // 📂 File validation
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    // 🔄 Convert file to Data URI
    const fileBuffer = getBuffer(file);
    // ☁️ Upload to Cloudinary
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer, {
        folder: "albums",
    });
    // 💾 Save to DB
    const result = await sql `INSERT INTO albums (name, artist, imageurl) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *`;
    return res
        .status(201)
        .json({ message: "Album added successfully", album: result[0] });
});
//# sourceMappingURL=controller.js.map