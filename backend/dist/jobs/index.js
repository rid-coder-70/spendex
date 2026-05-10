"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDetectionJob = exports.MonthlyReportJob = exports.JobScheduler = void 0;
const monthlyReport_1 = require("./monthlyReport");
Object.defineProperty(exports, "MonthlyReportJob", { enumerable: true, get: function () { return monthlyReport_1.MonthlyReportJob; } });
const subscriptionDetection_1 = require("./subscriptionDetection");
Object.defineProperty(exports, "SubscriptionDetectionJob", { enumerable: true, get: function () { return subscriptionDetection_1.SubscriptionDetectionJob; } });
class JobScheduler {
    static startAll() {
        console.log('🚀 Starting all cron jobs...');
        // Start monthly report job
        monthlyReport_1.MonthlyReportJob.start();
        // Start subscription detection job
        subscriptionDetection_1.SubscriptionDetectionJob.start();
        console.log('✅ All cron jobs started');
    }
    static stopAll() {
        console.log('⏹️  Stopping all cron jobs...');
        monthlyReport_1.MonthlyReportJob.stop();
        subscriptionDetection_1.SubscriptionDetectionJob.stop();
        console.log('✅ All cron jobs stopped');
    }
}
exports.JobScheduler = JobScheduler;
//# sourceMappingURL=index.js.map