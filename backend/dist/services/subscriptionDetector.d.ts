export declare class SubscriptionDetectorService {
    static detectSubscriptions(userId: number): Promise<{
        new_subscriptions: number;
        updated_subscriptions: number;
    }>;
    private static findRecurringPatterns;
    private static determineFrequency;
    private static calculateNextBillingDate;
    private static markInactiveSubscriptions;
}
//# sourceMappingURL=subscriptionDetector.d.ts.map