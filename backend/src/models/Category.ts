import { query } from '../config/database';
import { Category } from '../types';

export class CategoryModel {
  static async findAll(type?: 'expense' | 'income'): Promise<Category[]> {
    let sql = 'SELECT * FROM categories';
    const values: any[] = [];

    if (type) {
      sql += ' WHERE type = $1';
      values.push(type);
    }

    sql += ' ORDER BY name ASC';

    const result = await query(sql, values);
    return result.rows;
  }

  static async findById(id: number): Promise<Category | null> {
    const sql = 'SELECT * FROM categories WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  static async create(data: {
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    keywords?: string[];
  }): Promise<Category> {
    const sql = `
      INSERT INTO categories (name, type, icon, color, keywords, is_system)
      VALUES ($1, $2, $3, $4, $5, FALSE)
      RETURNING *
    `;

    const values = [
      data.name,
      data.type,
      data.icon || null,
      data.color || null,
      data.keywords || null,
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async autoCategorize(
    description: string,
    merchant?: string
  ): Promise<number | null> {
    const searchText = `${description} ${merchant || ''}`.toLowerCase();

    const sql = `
      SELECT id, keywords
      FROM categories
      WHERE keywords IS NOT NULL AND array_length(keywords, 1) > 0
      ORDER BY is_system DESC
    `;

    const result = await query(sql);

    for (const category of result.rows) {
      for (const keyword of category.keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          return category.id;
        }
      }
    }

    return null;
  }
}