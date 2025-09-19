import express from 'express';
import { registerUsers } from './controller.js';
const router = express.Router();

router.post('/register', registerUsers)
export default router;