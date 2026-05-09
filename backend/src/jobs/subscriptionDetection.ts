import cron, { ScheduledTask } from 'node-cron';
import { SubscriptionDetectorService } from '../services/subscriptionDetector';
import { query } from '../config/database';

export class SubscriptionDetectionJob {
  private static job: ScheduledTask | null = null;

  // Start the cron job
  static start(): void {
    // Run every day at 2:00 AM
    // Cron pattern: '0 2 * * *'

    this.job = cron.schedule('0 2 * * *', async () => {
      console.log('🔍 Subscription detection cron job triggered');

      try {
        // Get all users
        const usersSql = 'SELECT id FROM users';
        const usersResult = await query(usersSql);
        const users = usersResult.rows;

        let totalNew = 0;
        let totalUpdated = 0;

        for (const user of users) {
          try {
            const result = await SubscriptionDetectorService.detectSubscriptions(
              user.id
            );

            totalNew += result.new_subscriptions;
            totalUpdated += result.updated_subscriptions;
          } catch (error) {
            console.error(
              `❌ Failed to detect subscriptions for user ${user.id}:`,
              error
            );
          }
        }

        console.log(
          `✅ Subscription detection completed: ${totalNew} new, ${totalUpdated} updated across ${users.length} users`
        );
      } catch (error) {
        console.error('❌ Subscription detection job failed:', error);
      }
    });

    console.log('✅ Subscription detection cron job scheduled (daily at 2:00 AM)');
  }

  // Stop the cron job
  static stop(): void {
    if (this.job) {
      this.job.stop();
      console.log('⏹️  Subscription detection cron job stopped');
    }
  }

  // Run job manually (for testing)
  static async runNow(): Promise<void> {
    console.log('🔍 Running subscription detection job manually');

    try {
      const usersSql = 'SELECT id FROM users';
      const usersResult = await query(usersSql);
      const users = usersResult.rows;

      let totalNew = 0;
      let totalUpdated = 0;

      for (const user of users) {
        const result = await SubscriptionDetectorService.detectSubscriptions(
          user.id
        );

        totalNew += result.new_subscriptions;
        totalUpdated += result.updated_subscriptions;
      }

      console.log(
        `✅ Manual subscription detection completed: ${totalNew} new, ${totalUpdated} updated`
      );
    } catch (error) {
      console.error('❌ Manual subscription detection failed:', error);
      throw error;
    }
  }
}