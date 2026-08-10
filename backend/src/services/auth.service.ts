import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';

export const authService = {
  async registerUser(data: any) {
    throw new Error('User registration is now handled securely by Supabase Auth on the frontend.');
  },

  async loginUser(data: any) {
    throw new Error('User login is now handled securely by Supabase Auth on the frontend.');
  },

  async verifyGoogleUser(profile: any) {
    throw new Error('Google OAuth is now handled securely by Supabase Auth on the frontend.');
  },

  async verifySecretPin(userId: string, pin: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { secretPinHash: true },
    });

    if (!user || !user.secretPinHash) {
      throw { code: 'UNAUTHORIZED', message: 'Secret PIN not set' };
    }

    const isMatch = await bcrypt.compare(pin, user.secretPinHash);
    if (!isMatch) {
      throw { code: 'UNAUTHORIZED', message: 'Invalid secret PIN' };
    }

    return true;
  },
};
