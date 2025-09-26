
import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./routes/routes.js";
import cloudinary from "cloudinary";
import redis from 'redis';
import cors from 'cors';

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.Redis_Password || '',
  socket: {
    host: "redis-14863.crce198.eu-central-1-3.ec2.redns.redis-cloud.com",
    port: 14863,
  },
});
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Redis connection error:', err);
});


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

const app = express();
app.use(cors());
app.use(express.json());

async function connectToDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(225) NOT NULL,
        thumbnail VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(225) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log(" Database initialized successfully");
  } catch (error) {
    console.error(" Failed to connect to the database", error);
  }
}

app.use("/api/v1", adminRoutes);

const port = process.env.PORT || 5000;

connectToDB().then(() => {
  app.listen(port, () => {
    console.log(` Admin server is running at port:${port}`);
  });
});
