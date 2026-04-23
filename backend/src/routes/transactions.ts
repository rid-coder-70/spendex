import { Router, Response, Request } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// GET /api/transactions
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, category_id, type, start_date, end_date } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  const conditions: string[] = ['t.user_id = $1'];
  const values: unknown[] = [req.user?.id];
  let paramIdx = 2;

  if (category_id) { conditions.push(`t.category_id = $${paramIdx++}`); values.push(category_id); }
  if (type) { conditions.push(`t.type = $${paramIdx++}`); values.push(type); }
  if (start_date) { conditions.push(`t.transaction_date >= $${paramIdx++}`); values.push(start_date); }
  if (end_date) { conditions.push(`t.transaction_date <= $${paramIdx++}`); values.push(end_date); }

  const where = conditions.join(' AND ');

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM transactions t WHERE ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE ${where}
       ORDER BY t.transaction_date DESC, t.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      values
    );

    res.json({
      success: true,
      data: {
        transactions: result.rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          total_pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/transactions/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.icon as category_icon
       FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id=$1 AND t.user_id=$2`,
      [req.params.id, req.user?.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/transactions
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { amount, type, description, merchant, payment_method, transaction_date, category_id, notes } = req.body;

  if (!amount || !type || !transaction_date) {
    res.status(400).json({ success: false, message: 'Amount, type, and transaction_date are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, description, merchant, payment_method, transaction_date, category_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user?.id, amount, type, description, merchant, payment_method, transaction_date, category_id || null, notes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { amount, type, description, merchant, payment_method, transaction_date, category_id, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE transactions SET amount=$1, type=$2, description=$3, merchant=$4, payment_method=$5,
       transaction_date=$6, category_id=$7, notes=$8, updated_at=NOW()
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [amount, type, description, merchant, payment_method, transaction_date, category_id, notes, req.params.id, req.user?.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user?.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/transactions/upload (CSV Import)
router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    return;
  }

  const rows: Record<string, string>[] = [];
  const stream = Readable.from(req.file.buffer.toString());

  stream
    .pipe(csv())
    .on('data', (data: Record<string, string>) => rows.push(data))
    .on('end', async () => {
      let success = 0;
      let failed = 0;

      for (const row of rows) {
        try {
          const amount = parseFloat(row.amount || row.Amount || '0');
          const type = (row.type || row.Type || 'expense').toLowerCase();
          const description = row.description || row.Description || '';
          const transaction_date = row.date || row.Date || new Date().toISOString().split('T')[0];
          const merchant = row.merchant || row.Merchant || '';

          if (!amount || !['income', 'expense'].includes(type)) { failed++; continue; }

          await pool.query(
            `INSERT INTO transactions (user_id, amount, type, description, merchant, transaction_date)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [req.user?.id, amount, type, description, merchant, transaction_date]
          );

          success++;
        } catch {
          failed++;
        }
      }

      // Log upload history
      await pool.query(
        `INSERT INTO upload_history (user_id, filename, rows_processed, rows_imported, status)
         VALUES ($1,$2,$3,$4,$5)`,
        [req.user?.id, req.file!.originalname, rows.length, success, failed === 0 ? 'completed' : 'partial']
      ).catch(console.error);

      res.json({
        success: true,
        data: { total: rows.length, imported: success, failed },
      });
    })
    .on('error', (err: Error) => {
      res.status(500).json({ success: false, message: 'CSV parsing error', error: err.message });
    });
});

export default router;
