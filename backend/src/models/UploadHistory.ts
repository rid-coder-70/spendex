import { query } from '../config/database';

export interface UploadHistory {
  id: number;
  user_id: number;
  filename: string;
  file_size: number;
  rows_processed: number;
  rows_imported: number;
  rows_failed: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  uploaded_at: Date;
}

export class UploadHistoryModel {
  static async create(data: {
    user_id: number;
    filename: string;
    file_size: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
  }): Promise<UploadHistory> {
    const sql = `
      INSERT INTO upload_history (user_id, filename, file_size, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      data.user_id,
      data.filename,
      data.file_size,
      data.status || 'pending',
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async update(
    id: number,
    updates: {
      rows_processed?: number;
      rows_imported?: number;
      rows_failed?: number;
      status?: 'pending' | 'processing' | 'completed' | 'failed';
      error_message?: string;
    }
  ): Promise<UploadHistory | null> {
    const fields: string[] = [];
    const values: any[] = [id];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `
      UPDATE upload_history
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }


  static async findByUser(
    userId: number,
    limit: number = 10
  ): Promise<UploadHistory[]> {
    const sql = `
      SELECT * FROM upload_history
      WHERE user_id = $1
      ORDER BY uploaded_at DESC
      LIMIT $2
    `;

    const result = await query(sql, [userId, limit]);
    return result.rows;
  }

  // Get single upload record
  static async findById(
    id: number,
    userId: number
  ): Promise<UploadHistory | null> {
    const sql = `
      SELECT * FROM upload_history
      WHERE id = $1 AND user_id = $2
    `;

    const result = await query(sql, [id, userId]);
    return result.rows[0] || null;
  }
}