import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', authenticate, refreshSession);
router.post('/logout', authenticate, logoutUser);
router.post('/request-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),);



router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),);

export default router;