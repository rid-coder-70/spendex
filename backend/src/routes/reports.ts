import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reports/monthly
router.get('/monthly', authenticate, async (req: AuthRequest, res: Response) => {
  const { month, year } = req.query;
  const m = parseInt(month as string) || new Date().getMonth() + 1;
  const y = parseInt(year as string) || new Date().getFullYear();

  try {
    const summary = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0) AS net_savings,
        COUNT(*) AS transaction_count
       FROM transactions
       WHERE user_id=$1 AND EXTRACT(MONTH FROM transaction_date)=$2 AND EXTRACT(YEAR FROM transaction_date)=$3`,
      [req.user?.id, m, y]
    );

    const topCategories = await pool.query(
      `SELECT c.name, c.icon, c.color, SUM(t.amount) AS total
       FROM transactions t JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1 AND t.type='expense'
         AND EXTRACT(MONTH FROM t.transaction_date)=$2
         AND EXTRACT(YEAR FROM t.transaction_date)=$3
       GROUP BY c.name, c.icon, c.color
       ORDER BY total DESC LIMIT 5`,
      [req.user?.id, m, y]
    );

    const recentTransactions = await pool.query(
      `SELECT t.*, c.name as category_name
       FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id=$1 AND EXTRACT(MONTH FROM t.transaction_date)=$2
         AND EXTRACT(YEAR FROM t.transaction_date)=$3
       ORDER BY t.transaction_date DESC LIMIT 10`,
      [req.user?.id, m, y]
    );

    res.json({
      success: true,
      data: {
        period: { month: m, year: y },
        summary: summary.rows[0],
        top_categories: topCategories.rows,
        recent_transactions: recentTransactions.rows,
      },
    });
  } catch (err) {
    console.error('Monthly report error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/reports/email
router.post('/email', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await pool.query('SELECT name, email FROM users WHERE id=$1', [req.user?.id]);
    if (user.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    // Email sending handled by nodemailer - placeholder response
    res.json({
      success: true,
      message: `Monthly report queued to be sent to ${user.rows[0].email}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
