import { query } from '../config/database';

export interface MonthlySummary {
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  transaction_count: number;
  average_daily_expense: number;
  top_expense_category?: {
    id: number;
    name: string;
    amount: number;
    percentage: number;
  };
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
  average_amount: number;
}

export interface SpendingTrend {
  month: string;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  transaction_count: number;
}

export interface TopMerchant {
  amount: any;
  merchant: string;
  total_amount: number;
  transaction_count: number;
  average_amount: number;
  most_common_category?: string;
}

export class AnalyticsService {
  static async getMonthlySummary(
    userId: number,
    month: number,
    year: number
  ): Promise<MonthlySummary> {
    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COUNT(*) as transaction_count,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) / 
          NULLIF(EXTRACT(DAY FROM DATE_TRUNC('month', DATE($3 || '-' || LPAD($2::text, 2, '0') || '-01')) + INTERVAL '1 month' - INTERVAL '1 day'), 0), 0) 
          as average_daily_expense
      FROM transactions
      WHERE user_id = $1::int
        AND EXTRACT(MONTH FROM transaction_date) = $2::int
        AND EXTRACT(YEAR FROM transaction_date) = $3::int
    `;

    const result = await query(sql, [userId, month, year]);
    const row = result.rows[0];

    const totalIncome = parseFloat(row.total_income);
    const totalExpenses = parseFloat(row.total_expenses);

    const topCategorySql = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.color,
        SUM(t.amount) as total_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1::int
        AND t.type = 'expense'
        AND EXTRACT(MONTH FROM t.transaction_date) = $2::int
        AND EXTRACT(YEAR FROM t.transaction_date) = $3::int
      GROUP BY c.id, c.name, c.icon, c.color
      ORDER BY total_amount DESC
      LIMIT 1
    `;

    const topCategoryResult = await query(topCategorySql, [userId, month, year]);
    const topCategory = topCategoryResult.rows[0];

    return {
      month,
      year,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_savings: totalIncome - totalExpenses,
      transaction_count: parseInt(row.transaction_count),
      average_daily_expense: parseFloat(row.average_daily_expense),
      top_expense_category: topCategory
        ? {
            id: topCategory.id,
            name: topCategory.name,
            amount: parseFloat(topCategory.total_amount),
            percentage: (parseFloat(topCategory.total_amount) / totalExpenses) * 100,
          }
        : undefined,
    };
  }

  static async getCategoryBreakdown(
    userId: number,
    startDate?: string,
    endDate?: string,
    type?: 'expense' | 'income'
  ): Promise<CategoryBreakdown[]> {
    let sql = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        SUM(t.amount) as total_amount,
        COUNT(t.id) as transaction_count,
        AVG(t.amount) as average_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;

    const values: any[] = [userId];
    let paramCount = 1;

    if (type) {
      paramCount++;
      sql += ` AND t.type = $${paramCount}`;
      values.push(type);
    }

    if (startDate) {
      paramCount++;
      sql += ` AND t.transaction_date >= $${paramCount}`;
      values.push(startDate);
    }

    if (endDate) {
      paramCount++;
      sql += ` AND t.transaction_date <= $${paramCount}`;
      values.push(endDate);
    }

    sql += `
      GROUP BY c.id, c.name, c.icon, c.color
      ORDER BY total_amount DESC
    `;

    const result = await query(sql, values);

    const total = result.rows.reduce(
      (sum, row) => sum + parseFloat(row.total_amount),
      0
    );

    return result.rows.map((row) => ({
      category_id: row.category_id,
      category_name: row.category_name,
      category_icon: row.category_icon,
      category_color: row.category_color,
      total_amount: parseFloat(row.total_amount),
      transaction_count: parseInt(row.transaction_count),
      percentage: total > 0 ? (parseFloat(row.total_amount) / total) * 100 : 0,
      average_amount: parseFloat(row.average_amount),
    }));
  }

  static async getSpendingTrends(
    userId: number,
    months: number = 6
  ): Promise<SpendingTrend[]> {
    const sql = `
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE user_id = $1
        AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${months} months'
      GROUP BY TO_CHAR(transaction_date, 'YYYY-MM')
      ORDER BY month ASC
    `;

    const result = await query(sql, [userId]);

    return result.rows.map((row) => {
      const totalIncome = parseFloat(row.total_income);
      const totalExpenses = parseFloat(row.total_expenses);

      return {
        month: row.month,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_savings: totalIncome - totalExpenses,
        transaction_count: parseInt(row.transaction_count),
      };
    });
  }

  static async getTopMerchants(
    userId: number,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<TopMerchant[]> {
    let sql = `
      SELECT 
        t.merchant,
        SUM(t.amount) as total_amount,
        COUNT(t.id) as transaction_count,
        AVG(t.amount) as average_amount,
        (
          SELECT c.name 
          FROM transactions t2
          JOIN categories c ON t2.category_id = c.id
          WHERE t2.user_id = t.user_id 
            AND t2.merchant = t.merchant
          GROUP BY c.name
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) as most_common_category
      FROM transactions t
      WHERE t.user_id = $1
        AND t.merchant IS NOT NULL
        AND t.merchant != ''
    `;

    const values: any[] = [userId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      sql += ` AND t.transaction_date >= $${paramCount}`;
      values.push(startDate);
    }

    if (endDate) {
      paramCount++;
      sql += ` AND t.transaction_date <= $${paramCount}`;
      values.push(endDate);
    }

    sql += `
      GROUP BY t.user_id, t.merchant
      ORDER BY total_amount DESC
      LIMIT $${paramCount + 1}
    `;
    values.push(limit);

    const result = await query(sql, values);

    return result.rows.map((row) => ({
      amount: parseFloat(row.total_amount),
      merchant: row.merchant,
      total_amount: parseFloat(row.total_amount),
      transaction_count: parseInt(row.transaction_count),
      average_amount: parseFloat(row.average_amount),
      most_common_category: row.most_common_category,
    }));
  }

  static async getIncomeVsExpense(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<{
    total_income: number;
    total_expenses: number;
    net_savings: number;
    savings_rate: number;
  }> {
    const sql = `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      FROM transactions
      WHERE user_id = $1
        AND transaction_date >= $2
        AND transaction_date <= $3
    `;

    const result = await query(sql, [userId, startDate, endDate]);
    const row = result.rows[0];

    const totalIncome = parseFloat(row.total_income);
    const totalExpenses = parseFloat(row.total_expenses);
    const netSavings = totalIncome - totalExpenses;

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_savings: netSavings,
      savings_rate: totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0,
    };
  }
}