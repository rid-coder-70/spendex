import { query } from '../config/database';

interface RecurringPattern {
  merchant: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  transaction_count: number;
  first_date: Date;
  last_date: Date;
  average_interval_days: number;
  confidence_score: number;
  category_id?: number;
}

export class SubscriptionDetectorService {
  static async detectSubscriptions(userId: number): Promise<{
    new_subscriptions: number;
    updated_subscriptions: number;
  }> {
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

      const existingResult = await query(existingSql, [
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

        const nextBillingDate = this.calculateNextBillingDate(
          pattern.last_date,
          pattern.frequency
        );

        await query(updateSql, [
          pattern.frequency,
          pattern.last_date,
          nextBillingDate,
          pattern.confidence_score,
          subscription.id,
        ]);

        updatedCount++;
      } else {
        const insertSql = `
          INSERT INTO subscriptions (
            user_id, merchant, amount, frequency, category_id,
            last_transaction_date, next_billing_date, confidence_score, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
        `;

        const nextBillingDate = this.calculateNextBillingDate(
          pattern.last_date,
          pattern.frequency
        );

        await query(insertSql, [
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

    console.log(
      `✅ Subscription detection complete: ${newCount} new, ${updatedCount} updated`
    );

    return {
      new_subscriptions: newCount,
      updated_subscriptions: updatedCount,
    };
  }

  private static async findRecurringPatterns(
    userId: number
  ): Promise<RecurringPattern[]> {
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

    const result = await query(sql, [userId]);

    const patterns: RecurringPattern[] = [];

    for (const row of result.rows) {
      const dates: Date[] = row.dates.map((d: string) => new Date(d));

      const intervals: number[] = [];
      for (let i = 1; i < dates.length; i++) {
        const daysDiff =
          (dates[i].getTime() - dates[i - 1].getTime()) /
          (1000 * 60 * 60 * 24);
        intervals.push(daysDiff);
      }

      if (intervals.length === 0) continue;

      const avgInterval =
        intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

      const variance =
        intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) /
        intervals.length;
      const stdDev = Math.sqrt(variance);

      const { frequency, confidence } = this.determineFrequency(
        avgInterval,
        stdDev,
        intervals.length
      );

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

  private static determineFrequency(
    avgInterval: number,
    stdDev: number,
    sampleSize: number
  ): {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    confidence: number;
  } {
    let frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    let expectedInterval: number;

    if (avgInterval <= 2) {
      frequency = 'daily';
      expectedInterval = 1;
    } else if (avgInterval <= 10) {
      frequency = 'weekly';
      expectedInterval = 7;
    } else if (avgInterval <= 45) {
      frequency = 'monthly';
      expectedInterval = 30;
    } else {
      frequency = 'yearly';
      expectedInterval = 365;
    }

    const consistencyScore = Math.max(
      0,
      1 - stdDev / expectedInterval / 2
    );
    const sampleScore = Math.min(1, sampleSize / 6); 

    const confidence = (consistencyScore * 0.7 + sampleScore * 0.3);

    return {
      frequency,
      confidence: Math.round(confidence * 100) / 100,
    };
  }
  private static calculateNextBillingDate(
    lastDate: Date,
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): Date {
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

  private static async markInactiveSubscriptions(userId: number): Promise<void> {
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

    await query(sql, [userId]);
  }
}