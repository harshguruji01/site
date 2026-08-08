import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';

export const authService = {
  async registerUser(data: any) {
    const { name, username, email, password } = data;

    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      if (existing.email === email) throw new Error('Email is already registered');
      if (existing.username === username) throw new Error('Username is already taken');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        provider: 'local',
      },
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
  },

  async loginUser(data: any) {
    const { username, password } = data; // frontend passes 'username' which could be email

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { username: username }],
      },
    });

    if (!user || !user.passwordHash || !user.isActive) {
      throw { code: 'UNAUTHORIZED', message: 'Invalid credentials or inactive account' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw { code: 'UNAUTHORIZED', message: 'password_mismatch' }; // frontend checks for 'password_mismatch'
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  },

  async verifyGoogleUser(profile: any) {
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      // auto generate username from email
      const generatedUsername = profile.email.split('@')[0] + Math.floor(Math.random() * 1000);
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          username: generatedUsername,
          provider: 'google',
          providerAccountId: profile.id,
          avatarUrl: profile.picture,
          emailVerified: profile.verified_email || false,
        },
      });
    } else if (user.provider !== 'google') {
      // Update existing user with google provider info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'google',
          providerAccountId: profile.id,
          avatarUrl: user.avatarUrl || profile.picture,
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return { token, user };
  },
};
