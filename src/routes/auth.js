import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { sendResetPasswordEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { getOAuthUrlController } from '../controllers/auth.js';
import { validateGoogleOAuthSchema } from '../validation/validateGoogleOAuth.js';
import { verifyGoogleOAuthController } from '../controllers/auth.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', authenticate, refreshSession);
router.post('/logout', authenticate, logoutUser);
router.post('/send-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(sendResetPasswordEmailController),);



router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),);

  router.post('/get-oauth-url', ctrlWrapper(getOAuthUrlController));

  router.post(
  '/verify-google-oauth',
  validateBody(validateGoogleOAuthSchema),
  ctrlWrapper(verifyGoogleOAuthController),
);


export default router;