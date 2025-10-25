import express from 'express';
import { addToPlaylist, getProfile, loginUser, registerUsers } from '../controller/authcontroller.js';
import { isAuth } from '../middleware/middleware.js';
const router = express.Router();

router.post('/register', registerUsers)
router.post('/login', loginUser);
router.get('/me',isAuth, getProfile);
router.post("/playlist/:id", isAuth, addToPlaylist);


export default router;