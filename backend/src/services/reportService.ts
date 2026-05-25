import { AnalyticsService } from './analyticsService';
import { query } from '../config/database';
import { EmailService } from './emailService';

interface MonthlyReportData {
  userName: string;
  userEmail: string;
  month: number;
  monthName: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
  topCategories: Array<{
    name: string;
    icon: string;
    amount: number;
    percentage: number;
  }>;
  subscriptions: Array<{
    merchant: string;
    amount: number;
    frequency: string;
    nextBillingDate: Date;
  }>;
  totalSubscriptionCost: number;
  topMerchants: Array<{
    merchant: string;
    totalAmount: number;
  }>;
  insights: string[];
  dashboardUrl: string;
  unsubscribeUrl: string;
}

export class ReportService {
  static async generateMonthlyReport(
    userId: number,
    month: number,
    year: number
  ): Promise<MonthlyReportData> {
    console.log(`Generating report for user ${userId} - ${month}/${year}`);

    const userSql = 'SELECT name, email FROM users WHERE id = $1';
    const userResult = await query(userSql, [userId]);
    const user = userResult.rows[0];

    if (!user) {
      throw new Error('User not found');
    }


    const summary = await AnalyticsService.getMonthlySummary(userId, month, year);


    const categories = await AnalyticsService.getCategoryBreakdown(
      userId,
      `${year}-${String(month).padStart(2, '0')}-01`,
      `${year}-${String(month).padStart(2, '0')}-31`,
      'expense'
    );
    const topCategories = categories.slice(0, 5).map(cat => ({
      name: cat.category_name,
      icon: cat.category_icon || '',
      amount: cat.total_amount,
      percentage: cat.percentage,
    }));

    const subscriptionsSql = `
      SELECT merchant, amount, frequency, next_billing_date
      FROM subscriptions
      WHERE user_id = $1 AND is_active = TRUE
      ORDER BY amount DESC
    `;
    const subscriptionsResult = await query(subscriptionsSql, [userId]);
    const subscriptions = subscriptionsResult.rows;

    const totalSubscriptionCost = subscriptions
      .filter((s: any) => s.frequency === 'monthly')
      .reduce((sum: number, s: any) => sum + parseFloat(s.amount), 0);

    const merchants = await AnalyticsService.getTopMerchants(
      userId,
      5,
      `${year}-${String(month).padStart(2, '0')}-01`,
      `${year}-${String(month).padStart(2, '0')}-31`
    );

    const insights = this.generateInsights(
      summary,
      topCategories,
      subscriptions,
      month,
      year,
      userId
    );

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return {
      userName: user.name,
      userEmail: user.email,
      month,
      monthName: monthNames[month - 1],
      year,
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      netSavings: summary.net_savings,
      savingsRate:
        summary.total_income > 0
          ? (summary.net_savings / summary.total_income) * 100
          : 0,
      transactionCount: summary.transaction_count,
      topCategories,
      subscriptions,
      totalSubscriptionCost,
      topMerchants: merchants.map((merchant) => ({
        merchant: merchant.merchant,
        totalAmount: merchant.amount,
      })),
      insights: await insights,
      dashboardUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      unsubscribeUrl:
        (process.env.FRONTEND_URL || 'http://localhost:3000') + '/settings',
    };
  }


  private static async generateInsights(
    summary: any,
    topCategories: any[],
    subscriptions: any[],
    month: number,
    year: number,
    userId: number
  ): Promise<string[]> {
    const insights: string[] = [];

    const savingsRate =
      summary.total_income > 0
        ? (summary.net_savings / summary.total_income) * 100
        : 0;

    if (savingsRate >= 30) {
      insights.push(
        `Great job! You saved ${savingsRate.toFixed(1)}% of your income this month.`
      );
    } else if (savingsRate >= 20) {
      insights.push(
        `You saved ${savingsRate.toFixed(1)}% of your income. Consider increasing to 30% for better savings.`
      );
    } else if (savingsRate > 0) {
      insights.push(
        `Your savings rate is ${savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`
      );
    } else {
      insights.push(
        'You spent more than you earned this month. Consider reviewing your expenses.'
      );
    }

    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      insights.push(
        `${topCategory.name} was your biggest expense (${topCategory.percentage.toFixed(1)}% of total spending).`
      );
    }

    if (subscriptions.length > 0) {
      const monthlySubCost = subscriptions
        .filter((s: any) => s.frequency === 'monthly')
        .reduce((sum: number, s: any) => sum + parseFloat(s.amount), 0);

      if (monthlySubCost > summary.total_expenses * 0.1) {
        insights.push(
          `Subscriptions account for ${((monthlySubCost / summary.total_expenses) * 100).toFixed(1)}% of your expenses. Review if you need all of them.`
        );
      }
    }

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    try {
      const prevSummary = await AnalyticsService.getMonthlySummary(
        userId,
        prevMonth,
        prevYear
      );

      const expenseChange =
        ((summary.total_expenses - prevSummary.total_expenses) /
          prevSummary.total_expenses) *
        100;

      if (Math.abs(expenseChange) > 10) {
        if (expenseChange > 0) {
          insights.push(
            `Your spending increased by ${expenseChange.toFixed(1)}% compared to last month.`
          );
        } else {
          insights.push(
            `Great! You reduced spending by ${Math.abs(expenseChange).toFixed(1)}% compared to last month.`
          );
        }
      }
    } catch (error) {
    }


    if (summary.transaction_count > 100) {
      insights.push(
        `You made ${summary.transaction_count} transactions this month. Consider consolidating expenses.`
      );
    }

    return insights;
  }

  static async sendMonthlyReportEmail(
    userId: number,
    month: number,
    year: number
  ): Promise<boolean> {
    try {
      const reportData = await this.generateMonthlyReport(userId, month, year);

      const sent = await EmailService.sendTemplateEmail(
        reportData.userEmail,
        `Your ${reportData.monthName} ${reportData.year} Financial Report`,
        'monthly-report',
        reportData
      );

      if (sent) {
        console.log(
          `Monthly report sent to ${reportData.userEmail} for ${month}/${year}`
        );
      }

      return sent;
    } catch (error) {
      console.error('Failed to send monthly report:', error);
      return false;
    }
  }
  static async sendWelcomeEmail(
    name: string,
    email: string
  ): Promise<boolean> {
    try {
      const data = {
        name,
        dashboardUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        helpUrl:
          (process.env.FRONTEND_URL || 'http://localhost:3000') + '/help',
      };

      const sent = await EmailService.sendTemplateEmail(
        email,
        'Welcome to SpendGuard!',
        'welcome',
        data
      );

      if (sent) {
        console.log(`Welcome email sent to ${email}`);
      }

      return sent;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  static async sendMonthlyReportsToAllUsers(
    month: number,
    year: number
  ): Promise<{
    total: number;
    sent: number;
    failed: number;
  }> {
    console.log(`Sending monthly reports for ${month}/${year} to all users...`);

    const usersSql = `
      SELECT id, name, email 
      FROM users 
      WHERE email_notifications = TRUE
    `;

    const usersResult = await query(usersSql);
    const users = usersResult.rows;

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const success = await this.sendMonthlyReportEmail(
          user.id,
          month,
          year
        );

        if (success) {
          sent++;
        } else {
          failed++;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send report to user ${user.id}:`, error);
        failed++;
      }
    }

    console.log(
      `Monthly reports: ${sent} sent, ${failed} failed out of ${users.length} users`
    );

    return {
      total: users.length,
      sent,
      failed,
    };
  }
}