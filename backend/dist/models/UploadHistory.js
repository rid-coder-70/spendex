"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadHistoryModel = void 0;
const database_1 = require("../config/database");
class UploadHistoryModel {
    static async create(data) {
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
        const result = await (0, database_1.query)(sql, values);
        return result.rows[0];
    }
    static async update(id, updates) {
        const fields = [];
        const values = [id];
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
        const result = await (0, database_1.query)(sql, values);
        return result.rows[0] || null;
    }
    static async findByUser(userId, limit = 10) {
        const sql = `
      SELECT * FROM upload_history
      WHERE user_id = $1
      ORDER BY uploaded_at DESC
      LIMIT $2
    `;
        const result = await (0, database_1.query)(sql, [userId, limit]);
        return result.rows;
    }
    static async findById(id, userId) {
        const sql = `
      SELECT * FROM upload_history
      WHERE id = $1 AND user_id = $2
    `;
        const result = await (0, database_1.query)(sql, [id, userId]);
        return result.rows[0] || null;
    }
}
exports.UploadHistoryModel = UploadHistoryModel;
//# sourceMappingURL=UploadHistory.js.map