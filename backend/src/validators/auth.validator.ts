import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
  mobile: z.string().optional(),
  dob: z.string().optional(), // ISO date string
  gender: z.string().optional(),
  country: z.string().optional(),
  secretPin: z.string().min(4, 'Secret PIN must be at least 4 digits').max(8, 'Secret PIN must be at most 8 digits').regex(/^\d+$/, 'Secret PIN must be numeric').optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'), // can be email or username in reality, but frontend sends "username"
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
});

export const ResetPasswordSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
