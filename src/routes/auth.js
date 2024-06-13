import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', authenticate, refreshSession);
router.post('/logout', authenticate, logoutUser);

export default router;