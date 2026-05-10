"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDetectionJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const subscriptionDetector_1 = require("../services/subscriptionDetector");
const database_1 = require("../config/database");
class SubscriptionDetectionJob {
    // Start the cron job
    static start() {
        // Run every day at 2:00 AM
        // Cron pattern: '0 2 * * *'
        this.job = node_cron_1.default.schedule('0 2 * * *', async () => {
            console.log('🔍 Subscription detection cron job triggered');
            try {
                // Get all users
                const usersSql = 'SELECT id FROM users';
                const usersResult = await (0, database_1.query)(usersSql);
                const users = usersResult.rows;
                let totalNew = 0;
                let totalUpdated = 0;
                for (const user of users) {
                    try {
                        const result = await subscriptionDetector_1.SubscriptionDetectorService.detectSubscriptions(user.id);
                        totalNew += result.new_subscriptions;
                        totalUpdated += result.updated_subscriptions;
                    }
                    catch (error) {
                        console.error(`❌ Failed to detect subscriptions for user ${user.id}:`, error);
                    }
                }
                console.log(`✅ Subscription detection completed: ${totalNew} new, ${totalUpdated} updated across ${users.length} users`);
            }
            catch (error) {
                console.error('❌ Subscription detection job failed:', error);
            }
        });
        console.log('✅ Subscription detection cron job scheduled (daily at 2:00 AM)');
    }
    // Stop the cron job
    static stop() {
        if (this.job) {
            this.job.stop();
            console.log('⏹️  Subscription detection cron job stopped');
        }
    }
    // Run job manually (for testing)
    static async runNow() {
        console.log('🔍 Running subscription detection job manually');
        try {
            const usersSql = 'SELECT id FROM users';
            const usersResult = await (0, database_1.query)(usersSql);
            const users = usersResult.rows;
            let totalNew = 0;
            let totalUpdated = 0;
            for (const user of users) {
                const result = await subscriptionDetector_1.SubscriptionDetectorService.detectSubscriptions(user.id);
                totalNew += result.new_subscriptions;
                totalUpdated += result.updated_subscriptions;
            }
            console.log(`✅ Manual subscription detection completed: ${totalNew} new, ${totalUpdated} updated`);
        }
        catch (error) {
            console.error('❌ Manual subscription detection failed:', error);
            throw error;
        }
    }
}
exports.SubscriptionDetectionJob = SubscriptionDetectionJob;
SubscriptionDetectionJob.job = null;
//# sourceMappingURL=subscriptionDetection.js.map