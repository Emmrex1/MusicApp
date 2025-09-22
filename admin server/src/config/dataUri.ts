import DataURIParser from "datauri/parser.js";
import path from "path";
import type { Express } from "express";

const getBuffer = (file: Express.Multer.File): string => {
  const parser = new DataURIParser();

  const extName = path.extname(file.originalname).toString();

  const result = parser.format(extName, file.buffer);

  if (!result.content) {
    throw new Error("Invalid file format or empty buffer");
  }

  return result.content; 
};

export default getBuffer;
