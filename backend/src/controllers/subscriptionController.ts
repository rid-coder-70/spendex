import { Request, Response } from 'express';
import { query } from '../config/database';
import { SubscriptionDetectorService } from '../services/subscriptionDetector';

export class SubscriptionController {
  static async getAll(req: Request, res: Response) {
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

      const isActive = req.query.is_active;

      let sql = `
        SELECT 
          s.*,
          c.name as category_name,
          c.icon as category_icon,
          c.color as category_color
        FROM subscriptions s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.user_id = $1
      `;

      const values: any[] = [req.user.id];

      if (isActive !== undefined) {
        sql += ` AND s.is_active = $2`;
        values.push(isActive === 'true');
      }

      sql += ` ORDER BY s.is_active DESC, s.next_billing_date ASC`;

      const result = await query(sql, values);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error: any) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch subscriptions',
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
          error: {
            message: 'Not authenticated',
            code: 'NOT_AUTHENTICATED',
          },
        });
      }

      const id = Number(req.params.id);

      const sql = `
        SELECT 
          s.*,
          c.name as category_name,
          c.icon as category_icon
        FROM subscriptions s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.id = $1 AND s.user_id = $2
      `;

      const result = await query(sql, [id, req.user.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Subscription not found',
            code: 'NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch subscription',
          code: 'FETCH_ERROR',
        },
      });
    }
  }

  static async update(req: Request, res: Response) {
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

      const id = Number(req.params.id);
      const { is_active, notes } = req.body;

      const checkSql = `
        SELECT id FROM subscriptions 
        WHERE id = $1 AND user_id = $2
      `;
      const checkResult = await query(checkSql, [id, req.user.id]);

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Subscription not found',
            code: 'NOT_FOUND',
          },
        });
      }

      const updates: string[] = [];
      const values: any[] = [id, req.user.id];
      let paramCount = 2;

      if (is_active !== undefined) {
        paramCount++;
        updates.push(`is_active = $${paramCount}`);
        values.push(is_active);

        if (is_active === false) {
          paramCount++;
          updates.push(`cancelled_at = $${paramCount}`);
          values.push(new Date());
        }
      }

      if (notes !== undefined) {
        paramCount++;
        updates.push(`notes = $${paramCount}`);
        values.push(notes);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No fields to update',
            code: 'NO_UPDATES',
          },
        });
      }

      const updateSql = `
        UPDATE subscriptions
        SET ${updates.join(', ')}
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;

      const result = await query(updateSql, values);

      res.json({
        success: true,
        message: 'Subscription updated successfully',
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update subscription',
          code: 'UPDATE_ERROR',
        },
      });
    }
  }

  static async detect(req: Request, res: Response) {
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

      const result = await SubscriptionDetectorService.detectSubscriptions(
        req.user.id
      );

      res.json({
        success: true,
        message: 'Subscription detection completed',
        data: result,
      });
    } catch (error: any) {
      console.error('Subscription detection error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to detect subscriptions',
          code: 'DETECTION_ERROR',
        },
      });
    }
  }

  static async getStats(req: Request, res: Response) {
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

      const sql = `
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(*) FILTER (WHERE is_active = TRUE) as active_subscriptions,
          SUM(amount) FILTER (WHERE is_active = TRUE) as total_monthly_cost,
          COUNT(*) FILTER (WHERE frequency = 'monthly' AND is_active = TRUE) as monthly_count,
          COUNT(*) FILTER (WHERE frequency = 'yearly' AND is_active = TRUE) as yearly_count
        FROM subscriptions
        WHERE user_id = $1
      `;

      const result = await query(sql, [req.user.id]);
      const stats = result.rows[0];

      res.json({
        success: true,
        data: {
          total_subscriptions: parseInt(stats.total_subscriptions),
          active_subscriptions: parseInt(stats.active_subscriptions),
          total_monthly_cost: parseFloat(stats.total_monthly_cost || '0'),
          monthly_count: parseInt(stats.monthly_count),
          yearly_count: parseInt(stats.yearly_count),
        },
      });
    } catch (error: any) {
      console.error('Get subscription stats error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch subscription statistics',
          code: 'FETCH_ERROR',
        },
      });
    }
  }
}