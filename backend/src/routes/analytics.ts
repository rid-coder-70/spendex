import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/analytics/summary
router.get('/summary', authenticate, async (req: AuthRequest, res: Response) => {
  const { month, year } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();

  try {
    const result = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0) AS net_savings,
        COUNT(*) AS transaction_count
       FROM transactions
       WHERE user_id=$1
         AND EXTRACT(MONTH FROM transaction_date) = $2
         AND EXTRACT(YEAR FROM transaction_date) = $3`,
      [req.user?.id, m, y]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/analytics/category-breakdown
router.get('/category-breakdown', authenticate, async (req: AuthRequest, res: Response) => {
  const { month, year, type } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();

  try {
    const result = await pool.query(
      `SELECT c.name, c.icon, c.color, c.type,
              COALESCE(SUM(t.amount), 0) AS total,
              COUNT(t.id) AS count
       FROM categories c
       LEFT JOIN transactions t ON t.category_id = c.id
         AND t.user_id = $1
         AND EXTRACT(MONTH FROM t.transaction_date) = $2
         AND EXTRACT(YEAR FROM t.transaction_date) = $3
         ${type ? `AND t.type = '${type}'` : ''}
       GROUP BY c.id, c.name, c.icon, c.color, c.type
       HAVING COALESCE(SUM(t.amount), 0) > 0
       ORDER BY total DESC`,
      [req.user?.id, m, y]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/analytics/spending-trends
router.get('/spending-trends', authenticate, async (req: AuthRequest, res: Response) => {
  const { months = 6 } = req.query;

  try {
    const result = await pool.query(
      `SELECT
        EXTRACT(YEAR FROM transaction_date) AS year,
        EXTRACT(MONTH FROM transaction_date) AS month,
        TO_CHAR(transaction_date, 'Mon YYYY') AS label,
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS expenses
       FROM transactions
       WHERE user_id=$1
         AND transaction_date >= NOW() - INTERVAL '${parseInt(months as string)} months'
       GROUP BY year, month, label
       ORDER BY year, month`,
      [req.user?.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
