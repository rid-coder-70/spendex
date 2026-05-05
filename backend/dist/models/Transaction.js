"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const database_1 = require("../config/database");
class TransactionModel {
    static async create(data) {
        const sql = `
      INSERT INTO transactions (
        user_id, category_id, amount, type, description,
        merchant, payment_method, transaction_date, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const values = [
            data.user_id,
            data.category_id || null,
            data.amount,
            data.type,
            data.description || null,
            data.merchant || null,
            data.payment_method || null,
            data.transaction_date,
            data.notes || null,
        ];
        const result = await (0, database_1.query)(sql, values);
        return result.rows[0];
    }
    static async findByUser(userId, options = {}) {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const offset = (page - 1) * limit;
        let sql = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
        const values = [userId];
        let paramCount = 1;
        if (options.type) {
            paramCount++;
            sql += ` AND t.type = $${paramCount}`;
            values.push(options.type);
        }
        if (options.category_id) {
            paramCount++;
            sql += ` AND t.category_id = $${paramCount}`;
            values.push(options.category_id);
        }
        if (options.start_date) {
            paramCount++;
            sql += ` AND t.transaction_date >= $${paramCount}`;
            values.push(options.start_date);
        }
        if (options.end_date) {
            paramCount++;
            sql += ` AND t.transaction_date <= $${paramCount}`;
            values.push(options.end_date);
        }
        if (options.merchant) {
            paramCount++;
            sql += ` AND t.merchant ILIKE $${paramCount}`;
            values.push(`%${options.merchant}%`);
        }
        const countSql = `SELECT COUNT(*) FROM (${sql}) AS count_query`;
        const countResult = await (0, database_1.query)(countSql, values);
        const total = parseInt(countResult.rows[0].count);
        sql += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;
        sql += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        values.push(limit, offset);
        const result = await (0, database_1.query)(sql, values);
        return {
            transactions: result.rows,
            total,
        };
    }
    static async findById(id, userId) {
        const sql = `
      SELECT t.*, c.name as category_name, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1 AND t.user_id = $2
    `;
        const result = await (0, database_1.query)(sql, [id, userId]);
        return result.rows[0] || null;
    }
    static async update(id, userId, updates) {
        const allowedFields = [
            'category_id',
            'amount',
            'type',
            'description',
            'merchant',
            'payment_method',
            'transaction_date',
            'notes',
        ];
        const fields = Object.keys(updates)
            .filter((key) => allowedFields.includes(key))
            .map((key, index) => `${key} = $${index + 3}`)
            .join(', ');
        if (!fields) {
            throw new Error('No valid fields to update');
        }
        const values = Object.entries(updates)
            .filter(([key]) => allowedFields.includes(key))
            .map(([, value]) => value);
        const sql = `
      UPDATE transactions
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [id, userId, ...values]);
        return result.rows[0] || null;
    }
    static async delete(id, userId) {
        const sql = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2';
        const result = await (0, database_1.query)(sql, [id, userId]);
        return (result.rowCount || 0) > 0;
    }
    static async getSummary(userId, month, year) {
        const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE user_id = $1
        AND EXTRACT(MONTH FROM transaction_date) = $2
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `;
        const result = await (0, database_1.query)(sql, [userId, month, year]);
        const row = result.rows[0];
        return {
            total_income: parseFloat(row.total_income),
            total_expenses: parseFloat(row.total_expenses),
            net_savings: parseFloat(row.total_income) - parseFloat(row.total_expenses),
            transaction_count: parseInt(row.transaction_count),
        };
    }
}
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=Transaction.js.map