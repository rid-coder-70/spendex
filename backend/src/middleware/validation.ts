import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const formatZodErrors = (error: z.ZodError) => {
  return error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
};

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const result = RegisterSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: formatZodErrors(result.error) },
    });
  }
  next();
};

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: formatZodErrors(result.error) },
    });
  }
  next();
};

const TransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  type: z.enum(['expense', 'income']),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Transaction date must be in YYYY-MM-DD format'),
  category_id: z.number().optional(),
  description: z.string().optional(),
  merchant: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  is_recurring: z.boolean().optional()
});

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const result = TransactionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: formatZodErrors(result.error) },
    });
  }
  next();
};

const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.enum(['expense', 'income']),
  icon: z.string().optional(),
  color: z.string().optional()
});

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const result = CategorySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: formatZodErrors(result.error) },
    });
  }
  next();
};