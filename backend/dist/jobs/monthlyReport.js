"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyReportJob = void 0;
const node_cron_1 = require("node-cron");
const reportService_1 = require("../services/reportService");
class MonthlyReportJob {
    static start() {
        // Run on the 1st day of every month at 9:00 AM
        // Cron pattern: '0 9 1 * *' (minute hour day-of-month month day-of-week)
        if (process.env.MONTHLY_REPORT_ENABLED !== 'true') {
            console.log('📧 Monthly report job disabled');
            return;
        }
        this.job = (0, node_cron_1.schedule)('0 9 1 * *', async () => {
            console.log('📅 Monthly report cron job triggered');
            const now = new Date();
            const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
            const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            try {
                const result = await reportService_1.ReportService.sendMonthlyReportsToAllUsers(lastMonth, year);
                console.log(`✅ Monthly report job completed: ${result.sent}/${result.total} emails sent`);
            }
            catch (error) {
                console.error('❌ Monthly report job failed:', error);
            }
        });
        console.log('✅ Monthly report cron job scheduled (1st of every month at 9:00 AM)');
    }
    static stop() {
        if (this.job) {
            this.job.stop();
            console.log('⏹️  Monthly report cron job stopped');
        }
    }
    static async runNow(month, year) {
        const now = new Date();
        const targetMonth = month || (now.getMonth() === 0 ? 12 : now.getMonth());
        const targetYear = year || (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
        console.log(`📧 Running monthly report job manually for ${targetMonth}/${targetYear}`);
        try {
            const result = await reportService_1.ReportService.sendMonthlyReportsToAllUsers(targetMonth, targetYear);
            console.log(`✅ Manual report job completed: ${result.sent}/${result.total} emails sent`);
        }
        catch (error) {
            console.error('❌ Manual report job failed:', error);
            throw error;
        }
    }
}
exports.MonthlyReportJob = MonthlyReportJob;
MonthlyReportJob.job = null;
//# sourceMappingURL=monthlyReport.js.map