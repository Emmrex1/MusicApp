import DataURIParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: Express.Multer.File): string | null => {
  try {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toLowerCase();

    const base64 = parser.format(extName, file.buffer);

    if (!base64 || !base64.content) {
      return null;
    }

    return base64.content; 
  } catch (error) {
    console.error("❌ Error converting file to base64:", error);
    return null;
  }
};

export default getBuffer;
