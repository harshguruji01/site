import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', loginRateLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
