import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export class AnalyticsController {
  static async getMonthlySummary(req: Request, res: Response) {
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

      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);

      if (!month || !year || month < 1 || month > 12 || year < 2000) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid month or year',
            code: 'INVALID_PARAMS',
            details: 'Month must be 1-12, year must be >= 2000',
          },
        });
      }

      const summary = await AnalyticsService.getMonthlySummary(
        req.user.id,
        month,
        year
      );

      res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      console.error('Get monthly summary error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch monthly summary',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async getCategoryBreakdown(req: Request, res: Response) {
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

      const startDate = req.query.start_date as string | undefined;
      const endDate = req.query.end_date as string | undefined;
      const type = req.query.type as 'expense' | 'income' | undefined;

      const breakdown = await AnalyticsService.getCategoryBreakdown(
        req.user.id,
        startDate,
        endDate,
        type
      );

      res.json({
        success: true,
        data: breakdown,
      });
    } catch (error: any) {
      console.error('Get category breakdown error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch category breakdown',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async getSpendingTrends(req: Request, res: Response) {
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

      const months = parseInt(req.query.months as string) || 6;

      if (months < 1 || months > 24) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Months must be between 1 and 24',
            code: 'INVALID_PARAMS',
          },
        });
      }

      const trends = await AnalyticsService.getSpendingTrends(
        req.user.id,
        months
      );

      res.json({
        success: true,
        data: trends,
      });
    } catch (error: any) {
      console.error('Get spending trends error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch spending trends',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async getTopMerchants(req: Request, res: Response) {
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

      const limit = parseInt(req.query.limit as string) || 10;
      const startDate = req.query.start_date as string | undefined;
      const endDate = req.query.end_date as string | undefined;

      const merchants = await AnalyticsService.getTopMerchants(
        req.user.id,
        limit,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: merchants,
      });
    } catch (error: any) {
      console.error('Get top merchants error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch top merchants',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async getIncomeVsExpense(req: Request, res: Response) {
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

      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'start_date and end_date are required',
            code: 'MISSING_PARAMS',
          },
        });
      }

      const comparison = await AnalyticsService.getIncomeVsExpense(
        req.user.id,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: comparison,
      });
    } catch (error: any) {
      console.error('Get income vs expense error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch income vs expense',
          code: 'FETCH_ERROR',
        },
      });
    }
  }
}