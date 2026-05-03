import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { UserModel } from '../models/User';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided',
          code: 'NO_TOKEN',
        },
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = JWTUtils.verify(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN',
        },
      });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_ERROR',
      },
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = JWTUtils.verify(token);

    if (decoded) {
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  }

  next();
};