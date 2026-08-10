import { Request, Response, NextFunction } from 'express';
import { SignupSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validators/auth.validator';
import { authService } from '../services/auth.service';
import { env } from '../config/env';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    res.status(400).json({ success: false, message: 'Signup is now handled by Supabase Auth on the frontend.' });
  },

  async login(req: Request, res: Response, next: NextFunction) {
    res.status(400).json({ success: false, message: 'Login is now handled by Supabase Auth on the frontend.' });
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  },

  async me(req: any, res: Response, next: NextFunction) {
    res.json({ success: true, user: req.user });
  },

  async verifyPin(req: any, res: Response, next: NextFunction) {
    try {
      const { pin } = req.body;
      if (!pin) {
        return res.status(400).json({ success: false, message: 'PIN is required' });
      }
      await authService.verifySecretPin(req.user.id, pin);
      res.json({ success: true, message: 'PIN verified successfully' });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
};
