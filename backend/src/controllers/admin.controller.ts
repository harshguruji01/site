import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const adminController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            lastLoginAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isActive, role } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(isActive !== undefined && { isActive }),
          ...(role && { role }),
        },
        select: { id: true, email: true, isActive: true, role: true },
      });

      res.json({ success: true, message: 'User status updated', data: user });
    } catch (error) {
      next(error);
    }
  },
};
