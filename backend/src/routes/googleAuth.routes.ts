import { Router } from 'express';
import { googleAuthController } from '../controllers/googleAuth.controller';

const router = Router();

// Redirect to Google OAuth consent screen
router.get('/google', googleAuthController.redirectToGoogle);

// Google OAuth callback
router.get('/google/callback', googleAuthController.handleCallback);

export default router;