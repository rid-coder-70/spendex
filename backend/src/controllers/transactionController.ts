import { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction';
import { CategoryModel } from '../models/Category';

export class TransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as 'expense' | 'income' | undefined;
      const category_id = req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined;
      const start_date = req.query.start_date as string | undefined;
      const end_date = req.query.end_date as string | undefined;
      const merchant = req.query.merchant as string | undefined;

      const { transactions, total } = await TransactionModel.findByUser(
        req.user.id,
        { page, limit, type, category_id, start_date, end_date, merchant }
      );

      res.json({
        success: true,
        data: {
          items: transactions,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch transactions',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        });
      }

      const id = Number(req.params.id);

      const transaction = await TransactionModel.findById(id, req.user.id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Transaction not found',
            code: 'NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error: any) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch transaction',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        });
      }

      const {
        category_id,
        amount,
        type,
        description,
        merchant,
        payment_method,
        transaction_date,
        notes,
      } = req.body;

      let finalCategoryId = category_id;

      if (finalCategoryId) {
        const category = await CategoryModel.findById(Number(finalCategoryId));
        if (!category) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Invalid category ID',
              code: 'INVALID_CATEGORY',
            },
          });
        }
      }

      if (!finalCategoryId && (description || merchant)) {
        finalCategoryId = await CategoryModel.autoCategorize(
          description || '',
          merchant
        );
      }

      const transaction = await TransactionModel.create({
        user_id: req.user.id,
        category_id: finalCategoryId,
        amount: parseFloat(amount),
        type,
        description,
        merchant,
        payment_method,
        transaction_date,
        notes,
      });

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error: any) {
      console.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create transaction',
          code: 'CREATE_ERROR',
        },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        });
      }

      const id = Number(req.params.id);
      const updates = req.body;

      if (updates.amount) {
        updates.amount = parseFloat(updates.amount);
      }

      if (updates.category_id) {
        const category = await CategoryModel.findById(Number(updates.category_id));
        if (!category) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Invalid category ID',
              code: 'INVALID_CATEGORY',
            },
          });
        }
      }

      const transaction = await TransactionModel.update(
        id,
        req.user.id,
        updates
      );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Transaction not found',
            code: 'NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      });
    } catch (error: any) {
      console.error('Update transaction error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update transaction',
          code: 'UPDATE_ERROR',
        },
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
        });
      }

      const id = Number(req.params.id);

      const deleted = await TransactionModel.delete(id, req.user.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Transaction not found',
            code: 'NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete transaction error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete transaction',
          code: 'DELETE_ERROR',
        },
      });
    }
  }
}