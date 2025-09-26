import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './routes/routes.js';
import redis from 'redis';
import cors from 'cors'

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



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1', songRoutes);

const port = process.env.PORT 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})