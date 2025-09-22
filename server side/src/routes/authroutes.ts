import express from 'express';
import { getProfile, loginUser, registerUsers } from '../controller/authcontroller.js';
import { isAuth } from '../middleware/middleware.js';
const router = express.Router();

router.post('/register', registerUsers)
 router.post('/login', loginUser);
router.get('/me',isAuth, getProfile);
export default router;