import { Request, Response, NextFunction } from 'express';
import { SignupSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validators/auth.validator';
import { authService } from '../services/auth.service';
import { env } from '../config/env';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = SignupSchema.parse(req.body);
      const user = await authService.registerUser(data);
      res.status(201).json({ success: true, message: 'Account created successfully', data: user });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation failed', error: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = LoginSchema.parse(req.body);
      const { token, user } = await authService.loginUser(data);

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ success: true, message: 'Logged in successfully', name: user.name, email: user.email, data: user });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation failed', error: error.errors });
      }
      res.status(401).json({ success: false, message: error.message, reason: error.code === 'UNAUTHORIZED' ? error.message : undefined });
    }
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
