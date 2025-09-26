import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRoutes from './routes/authroutes.js';
import cors from 'cors';


dotenv.config();

const connectedDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "musicApp"
    });
    console.log("MongoDb connected successfully");
  
    } catch (error) {
    console.log(error)
  }

  }

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/users', UserRoutes);


app.get('/', (req, res) => {
  res.send('Server is running smoothly!');
});


const PORT = process.env.PORT || 4003;

app.listen(4003, () => {
  console.log(`Server is running on port ${PORT}`);
    connectedDB();
});