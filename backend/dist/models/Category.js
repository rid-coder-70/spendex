"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const database_1 = require("../config/database");
class CategoryModel {
    static async findAll(type) {
        let sql = 'SELECT * FROM categories';
        const values = [];
        if (type) {
            sql += ' WHERE type = $1';
            values.push(type);
        }
        sql += ' ORDER BY name ASC';
        const result = await (0, database_1.query)(sql, values);
        return result.rows;
    }
    static async findById(id) {
        const sql = 'SELECT * FROM categories WHERE id = $1';
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async create(data) {
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
        const result = await (0, database_1.query)(sql, values);
        return result.rows[0];
    }
    static async seedDefaults() {
        const defaultCategories = [
            {
                name: 'Food',
                type: 'expense',
                icon: 'utensils',
                color: '#FF6B6B',
                keywords: [
                    'restaurant',
                    'food',
                    'coffee',
                    'meal',
                    'grocery',
                    'supermarket',
                    'dinner',
                    'lunch',
                ],
            },
            {
                name: 'Transport',
                type: 'expense',
                icon: 'bus',
                color: '#4D96FF',
                keywords: [
                    'uber',
                    'taxi',
                    'bus',
                    'train',
                    'metro',
                    'transport',
                    'rideshare',
                    'flight',
                    'travel',
                ],
            },
            {
                name: 'Shopping',
                type: 'expense',
                icon: 'shopping-bag',
                color: '#FFB800',
                keywords: [
                    'amazon',
                    'shop',
                    'shopping',
                    'store',
                    'mall',
                    'purchase',
                    'order',
                ],
            },
            {
                name: 'Utilities',
                type: 'expense',
                icon: 'lightbulb',
                color: '#7C3AED',
                keywords: [
                    'electricity',
                    'water bill',
                    'internet',
                    'gas bill',
                    'utility',
                    'utilities',
                ],
            },
            {
                name: 'Entertainment',
                type: 'expense',
                icon: 'play',
                color: '#F97316',
                keywords: [
                    'netflix',
                    'movie',
                    'game',
                    'concert',
                    'entertainment',
                    'spotify',
                    'show',
                ],
            },
            {
                name: 'Salary',
                type: 'income',
                icon: 'wallet',
                color: '#22C55E',
                keywords: ['salary', 'payroll', 'paycheck', 'income', 'deposit'],
            },
            {
                name: 'Savings',
                type: 'income',
                icon: 'piggy-bank',
                color: '#10B981',
                keywords: ['savings', 'interest', 'investment', 'dividend'],
            },
        ];
        for (const category of defaultCategories) {
            const existing = await (0, database_1.query)('SELECT id FROM categories WHERE name = $1', [category.name]);
            if (existing.rows.length === 0) {
                await (0, database_1.query)(`
            INSERT INTO categories (name, type, icon, color, keywords, is_system)
            VALUES ($1, $2, $3, $4, $5, TRUE)
          `, [
                    category.name,
                    category.type,
                    category.icon,
                    category.color,
                    category.keywords,
                ]);
            }
        }
    }
    static async autoCategorize(description, merchant) {
        const searchText = `${description} ${merchant || ''}`.toLowerCase();
        const sql = `
      SELECT id, keywords
      FROM categories
      WHERE keywords IS NOT NULL AND array_length(keywords, 1) > 0
      ORDER BY is_system DESC
    `;
        const result = await (0, database_1.query)(sql);
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
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=Category.js.map