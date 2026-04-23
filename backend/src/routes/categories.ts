import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/categories
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY is_system DESC, name ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/categories
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, type, icon, color, keywords } = req.body;

  if (!name || !type) {
    res.status(400).json({ success: false, message: 'Name and type are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, type, icon, color, keywords, is_system)
       VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
      [name, type, icon || '📦', color || '#6366f1', keywords || []]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, type, icon, color, keywords } = req.body;

  try {
    const result = await pool.query(
      `UPDATE categories SET name=$1, type=$2, icon=$3, color=$4, keywords=$5
       WHERE id=$6 AND is_system=false RETURNING *`,
      [name, type, icon, color, keywords, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Category not found or is a system category' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categories WHERE id=$1 AND is_system=false RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Category not found or is a system category' });
      return;
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
