"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
class UserModel {
    static async create(name, email, password_hash, phone) {
        const sql = `
      INSERT INTO users (name, email, password_hash, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = await (0, database_1.query)(sql, [name, email, password_hash, phone]);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await (0, database_1.query)(sql, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = $1';
        const result = await (0, database_1.query)(sql, [id]);
        return result.rows[0] || null;
    }
    static async update(id, updates) {
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
        const result = await (0, database_1.query)(sql, [id, ...values]);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const sql = 'DELETE FROM users WHERE id = $1';
        const result = await (0, database_1.query)(sql, [id]);
        return (result.rowCount || 0) > 0;
    }
    static async emailExists(email) {
        const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
        const result = await (0, database_1.query)(sql, [email]);
        return result.rows[0].exists;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map