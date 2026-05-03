import { query } from '../config/database';
import { User } from '../types/index';

export class UserModel {
  static async create(
    name: string,
    email: string,
    password_hash: string,
    phone?: string
  ): Promise<User> {
    const sql = `
      INSERT INTO users (name, email, password_hash, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(sql, [name, email, password_hash, phone]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async update(
    id: number,
    updates: Partial<User>
  ): Promise<User | null> {
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates);
    
    const sql = `
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [id, ...values]);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    return (result.rowCount || 0) > 0;
  }

  static async emailExists(email: string): Promise<boolean> {
    const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await query(sql, [email]);
    return result.rows[0].exists;
  }
}