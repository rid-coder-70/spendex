import { Request, Response, NextFunction } from 'express';
import { ValidationUtils } from '../utils/validation';
import { PasswordUtils } from '../utils/password';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, phone } = req.body;
  const errors: string[] = [];

  if (!name || !ValidationUtils.isValidName(name)) {
    errors.push('Name must be between 2 and 100 characters');
  }

  if (!email || !ValidationUtils.isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = PasswordUtils.validate(password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
  }


  if (phone && !ValidationUtils.isValidPhone(phone)) {
    errors.push('Invalid phone number format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || !ValidationUtils.isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  }

  next();
};