import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
