import { MonthlyReportJob } from './monthlyReport';
import { SubscriptionDetectionJob } from './subscriptionDetection';

export class JobScheduler {
  static startAll(): void {
    console.log('Starting all cron jobs...');

    MonthlyReportJob.start();

    SubscriptionDetectionJob.start();

    console.log('All cron jobs started');
  }

  static stopAll(): void {
    console.log('Stopping all cron jobs...');

    MonthlyReportJob.stop();
    SubscriptionDetectionJob.stop();

    console.log('All cron jobs stopped');
  }
}

export { MonthlyReportJob, SubscriptionDetectionJob };