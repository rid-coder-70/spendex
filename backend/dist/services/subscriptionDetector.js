"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDetectorService = void 0;
const database_1 = require("../config/database");
class SubscriptionDetectorService {
    static async detectSubscriptions(userId) {
        console.log(`🔍 Detecting subscriptions for user ${userId}...`);
        const patterns = await this.findRecurringPatterns(userId);
        console.log(`📊 Found ${patterns.length} potential recurring patterns`);
        let newCount = 0;
        let updatedCount = 0;
        for (const pattern of patterns) {
            const existingSql = `
        SELECT id, is_active 
        FROM subscriptions 
        WHERE user_id = $1 
          AND merchant = $2 
          AND ABS(amount - $3) < 0.01
      `;
            const existingResult = await (0, database_1.query)(existingSql, [
                userId,
                pattern.merchant,
                pattern.amount,
            ]);
            if (existingResult.rows.length > 0) {
                const subscription = existingResult.rows[0];
                const updateSql = `
          UPDATE subscriptions
          SET 
            frequency = $1,
            last_transaction_date = $2,
            next_billing_date = $3,
            confidence_score = $4,
            is_active = TRUE
          WHERE id = $5
        `;
                const nextBillingDate = this.calculateNextBillingDate(pattern.last_date, pattern.frequency);
                await (0, database_1.query)(updateSql, [
                    pattern.frequency,
                    pattern.last_date,
                    nextBillingDate,
                    pattern.confidence_score,
                    subscription.id,
                ]);
                updatedCount++;
            }
            else {
                const insertSql = `
          INSERT INTO subscriptions (
            user_id, merchant, amount, frequency, category_id,
            last_transaction_date, next_billing_date, confidence_score, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
        `;
                const nextBillingDate = this.calculateNextBillingDate(pattern.last_date, pattern.frequency);
                await (0, database_1.query)(insertSql, [
                    userId,
                    pattern.merchant,
                    pattern.amount,
                    pattern.frequency,
                    pattern.category_id || null,
                    pattern.last_date,
                    nextBillingDate,
                    pattern.confidence_score,
                ]);
                newCount++;
            }
        }
        await this.markInactiveSubscriptions(userId);
        console.log(`✅ Subscription detection complete: ${newCount} new, ${updatedCount} updated`);
        return {
            new_subscriptions: newCount,
            updated_subscriptions: updatedCount,
        };
    }
    static async findRecurringPatterns(userId) {
        const sql = `
      SELECT 
        merchant,
        ROUND(amount::numeric, 2) as amount,
        category_id,
        COUNT(*) as transaction_count,
        MIN(transaction_date) as first_date,
        MAX(transaction_date) as last_date,
        ARRAY_AGG(transaction_date ORDER BY transaction_date) as dates
      FROM transactions
      WHERE user_id = $1
        AND merchant IS NOT NULL
        AND merchant != ''
        AND type = 'expense'
        AND transaction_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY merchant, ROUND(amount::numeric, 2), category_id
      HAVING COUNT(*) >= 3
      ORDER BY COUNT(*) DESC
    `;
        const result = await (0, database_1.query)(sql, [userId]);
        const patterns = [];
        for (const row of result.rows) {
            const dates = row.dates.map((d) => new Date(d));
            const intervals = [];
            for (let i = 1; i < dates.length; i++) {
                const daysDiff = (dates[i].getTime() - dates[i - 1].getTime()) /
                    (1000 * 60 * 60 * 24);
                intervals.push(daysDiff);
            }
            if (intervals.length === 0)
                continue;
            const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
            const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) /
                intervals.length;
            const stdDev = Math.sqrt(variance);
            const { frequency, confidence } = this.determineFrequency(avgInterval, stdDev, intervals.length);
            if (confidence >= 0.6) {
                patterns.push({
                    merchant: row.merchant,
                    amount: parseFloat(row.amount),
                    frequency,
                    transaction_count: parseInt(row.transaction_count),
                    first_date: new Date(row.first_date),
                    last_date: new Date(row.last_date),
                    average_interval_days: avgInterval,
                    confidence_score: confidence,
                    category_id: row.category_id,
                });
            }
        }
        return patterns;
    }
    static determineFrequency(avgInterval, stdDev, sampleSize) {
        let frequency;
        let expectedInterval;
        if (avgInterval <= 2) {
            frequency = 'daily';
            expectedInterval = 1;
        }
        else if (avgInterval <= 10) {
            frequency = 'weekly';
            expectedInterval = 7;
        }
        else if (avgInterval <= 45) {
            frequency = 'monthly';
            expectedInterval = 30;
        }
        else {
            frequency = 'yearly';
            expectedInterval = 365;
        }
        const consistencyScore = Math.max(0, 1 - stdDev / expectedInterval / 2);
        const sampleScore = Math.min(1, sampleSize / 6);
        const confidence = (consistencyScore * 0.7 + sampleScore * 0.3);
        return {
            frequency,
            confidence: Math.round(confidence * 100) / 100,
        };
    }
    static calculateNextBillingDate(lastDate, frequency) {
        const nextDate = new Date(lastDate);
        switch (frequency) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        return nextDate;
    }
    static async markInactiveSubscriptions(userId) {
        const sql = `
      UPDATE subscriptions
      SET is_active = FALSE
      WHERE user_id = $1
        AND is_active = TRUE
        AND (
          (frequency = 'monthly' AND last_transaction_date < CURRENT_DATE - INTERVAL '45 days')
          OR (frequency = 'yearly' AND last_transaction_date < CURRENT_DATE - INTERVAL '400 days')
          OR (frequency = 'weekly' AND last_transaction_date < CURRENT_DATE - INTERVAL '14 days')
          OR (frequency = 'daily' AND last_transaction_date < CURRENT_DATE - INTERVAL '7 days')
        )
    `;
        await (0, database_1.query)(sql, [userId]);
    }
}
exports.SubscriptionDetectorService = SubscriptionDetectorService;
//# sourceMappingURL=subscriptionDetector.js.map