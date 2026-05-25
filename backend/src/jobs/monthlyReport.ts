import cron from 'node-cron';
import { schedule, ScheduledTask } from 'node-cron';
import { ReportService } from '../services/reportService';

export class MonthlyReportJob {
  private static job: ScheduledTask | null = null;


  static start(): void {
    
    if (process.env.MONTHLY_REPORT_ENABLED !== 'true') {
      console.log('Monthly report job disabled');
      return;
    }

    this.job = schedule('0 9 1 * *', async () => {
      console.log('Monthly report cron job triggered');

      const now = new Date();
      const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      try {
        const result = await ReportService.sendMonthlyReportsToAllUsers(
          lastMonth,
          year
        );

        console.log(
          `Monthly report job completed: ${result.sent}/${result.total} emails sent`
        );
      } catch (error) {
        console.error('Monthly report job failed:', error);
      }
    });

    console.log('Monthly report cron job scheduled (1st of every month at 9:00 AM)');
  }


  static stop(): void {
    if (this.job) {
      this.job.stop();
      console.log('⏹️  Monthly report cron job stopped');
    }
  }

  static async runNow(month?: number, year?: number): Promise<void> {
    const now = new Date();
    const targetMonth = month || (now.getMonth() === 0 ? 12 : now.getMonth());
    const targetYear =
      year || (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());

    console.log(`📧 Running monthly report job manually for ${targetMonth}/${targetYear}`);

    try {
      const result = await ReportService.sendMonthlyReportsToAllUsers(
        targetMonth,
        targetYear
      );

      console.log(
        `✅ Manual report job completed: ${result.sent}/${result.total} emails sent`
      );
    } catch (error) {
      console.error('❌ Manual report job failed:', error);
      throw error;
    }
  }
}