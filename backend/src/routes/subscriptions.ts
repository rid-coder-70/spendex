import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/subscriptions
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as category_name, c.icon as category_icon
       FROM subscriptions s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.user_id=$1 AND s.is_active=true
       ORDER BY s.next_billing_date ASC`,
      [req.user?.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/subscriptions/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { merchant, amount, frequency, next_billing_date, category_id, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE subscriptions SET merchant=$1, amount=$2, frequency=$3,
       next_billing_date=$4, category_id=$5, is_active=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [merchant, amount, frequency, next_billing_date, category_id, is_active, req.params.id, req.user?.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/subscriptions/detect
router.post('/detect', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Detect recurring transactions as potential subscriptions
    const result = await pool.query(
      `SELECT merchant, COUNT(*) as occurrences,
              AVG(amount) as avg_amount,
              MAX(transaction_date) as last_date
       FROM transactions
       WHERE user_id=$1 AND type='expense' AND merchant IS NOT NULL AND merchant != ''
       GROUP BY merchant
       HAVING COUNT(*) >= 2
       ORDER BY occurrences DESC`,
      [req.user?.id]
    );

    // Insert detected subscriptions
    for (const row of result.rows) {
      const existing = await pool.query(
        'SELECT id FROM subscriptions WHERE user_id=$1 AND merchant=$2',
        [req.user?.id, row.merchant]
      );
      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO subscriptions (user_id, merchant, amount, frequency, is_active, confidence_score, detected_at)
           VALUES ($1,$2,$3,'monthly',true,$4,NOW())
           ON CONFLICT DO NOTHING`,
          [req.user?.id, row.merchant, row.avg_amount, Math.min(row.occurrences * 0.2, 1.0)]
        );
      }
    }

    const detected = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id=$1 AND is_active=true ORDER BY detected_at DESC',
      [req.user?.id]
    );

    res.json({ success: true, data: detected.rows, detected_count: result.rows.length });
  } catch (err) {
    console.error('Detect subscriptions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
