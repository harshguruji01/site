import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    email?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check Authorization header first (Bearer token from Supabase client)
    let token = req.headers.authorization?.split(' ')[1];
    
    // Fallback to cookie if present
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify the Supabase JWT using the Supabase JWT Secret
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    
    // Supabase JWTs contain the user ID in the 'sub' field
    req.user = {
      id: decoded.sub,
      role: decoded.role || 'authenticated',
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
