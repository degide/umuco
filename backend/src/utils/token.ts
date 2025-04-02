
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';

export const generateToken = (
  id: string,
  role: UserRole
): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'fallback_secret' as any,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' as any,
    }
  );
};

export const generateRefreshToken = (
  id: string,
  role: UserRole
): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret' as any,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' as any,
    }
  );
};

export const verifyRefreshToken = (
  token: string
): { id: string; role: UserRole } => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
  ) as { id: string; role: UserRole };
  
  return decoded;
};
