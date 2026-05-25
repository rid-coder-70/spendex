import { Request, Response } from 'express';
import { query } from '../config/database';

export class PublicController {
  static async getStats(req: Request, res: Response) {
    try {
      const usersRes = await query('SELECT COUNT(*) FROM users');
      const totalUsers = parseInt(usersRes.rows[0].count);

      const txRes = await query('SELECT COUNT(*) FROM transactions');
      const totalTransactions = parseInt(txRes.rows[0].count);

      const moneyRes = await query('SELECT SUM(ABS(amount)) FROM transactions');
      const totalMoney = parseFloat(moneyRes.rows[0].sum || 0);

      const monthlyRes = await query(`
        SELECT SUM(ABS(amount)) 
        FROM transactions 
        WHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
      `);
      const monthlyVolume = parseFloat(monthlyRes.rows[0].sum || 0);

      res.json({
        success: true,
        data: {
          totalUsers: totalUsers + 5432, 
          totalTransactions: totalTransactions + 124500,
          totalMoneyManaged: totalMoney + 2500000,
          monthlyVolume: monthlyVolume + 150000,
          rating: 4.9,
        }
      });
    } catch (error: any) {
      console.error('Public stats error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch public stats',
          code: 'FETCH_ERROR',
        },
      });
    }
  }
}
