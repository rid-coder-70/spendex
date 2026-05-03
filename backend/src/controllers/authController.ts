import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { PasswordUtils } from '../utils/password';
import { JWTUtils } from '../utils/jwt';
import { ValidationUtils } from '../utils/validation';

export class AuthController {

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;


      const sanitizedName = ValidationUtils.sanitizeString(name);
      const sanitizedEmail = email.toLowerCase().trim();


      const emailExists = await UserModel.emailExists(sanitizedEmail);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Email already registered',
            code: 'EMAIL_EXISTS',
          },
        });
      }

      const password_hash = await PasswordUtils.hash(password);

      const user = await UserModel.create(
        sanitizedName,
        sanitizedEmail,
        password_hash,
        phone
      );


      const token = JWTUtils.generate({
        id: user.id,
        email: user.email,
      });

      const { password_hash: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Registration failed',
          code: 'REGISTRATION_ERROR',
        },
      });
    }
  }


  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const sanitizedEmail = email.toLowerCase().trim();

      const user = await UserModel.findByEmail(sanitizedEmail);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
          },
        });
      }

      const isPasswordValid = await PasswordUtils.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
          },
        });
      }


      const token = JWTUtils.generate({
        id: user.id,
        email: user.email,
      });

      const { password_hash: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Login failed',
          code: 'LOGIN_ERROR',
        },
      });
    }
  }


  static async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'NOT_AUTHENTICATED',
          },
        });
      }

      const { password_hash: _, ...userWithoutPassword } = req.user;

      res.json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to get user info',
          code: 'GET_USER_ERROR',
        },
      });
    }
  }
}