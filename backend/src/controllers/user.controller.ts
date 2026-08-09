import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const userController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          fullName: true,
          mobile: true,
          dob: true,
          gender: true,
          country: true,
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, avatarUrl, fullName, mobile, dob, gender, country } = req.body;
      const user = await prisma.user.update({
        where: { id: req.user?.id },
        data: { name, avatarUrl, fullName, mobile, dob: dob ? new Date(dob) : null, gender, country },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatarUrl: true,
          role: true,
          fullName: true,
          mobile: true,
          dob: true,
          gender: true,
          country: true,
        },
      });

      res.json({ success: true, message: 'Profile updated', data: user });
    } catch (error) {
      next(error);
    }
  }
};
