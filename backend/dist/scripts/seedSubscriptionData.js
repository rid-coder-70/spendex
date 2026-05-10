"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../models/Transaction");
const subscriptionDetector_1 = require("../services/subscriptionDetector");
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function seedSubscriptionData() {
    try {
        console.log('🌱 Seeding subscription test data...');
        const userId = 1;
        // Clear existing subscription transactions for this user
        await (0, database_1.query)('DELETE FROM transactions WHERE user_id = $1 AND merchant IN ($2, $3, $4, $5, $6)', [
            userId,
            'Netflix',
            'Spotify',
            'Fitness First',
            'ISP Provider',
            'Google'
        ]);
        const subscriptionTransactions = [
            {
                user_id: userId,
                category_id: 3,
                amount: 799,
                type: 'expense',
                description: 'Netflix subscription',
                merchant: 'Netflix',
                payment_method: 'Credit Card',
                dates: [
                    '2025-11-15',
                    '2025-12-15',
                    '2026-01-15',
                    '2026-02-15',
                    '2026-03-15',
                    '2026-04-15',
                ],
            },
            {
                user_id: userId,
                category_id: 3,
                amount: 399,
                type: 'expense',
                description: 'Spotify Premium',
                merchant: 'Spotify',
                payment_method: 'Credit Card',
                dates: [
                    '2025-11-10',
                    '2025-12-10',
                    '2026-01-10',
                    '2026-02-10',
                    '2026-03-10',
                    '2026-04-10',
                ],
            },
            {
                user_id: userId,
                category_id: 13,
                amount: 3000,
                type: 'expense',
                description: 'Gym membership',
                merchant: 'Fitness First',
                payment_method: 'bKash',
                dates: [
                    '2025-11-01',
                    '2025-12-01',
                    '2026-01-01',
                    '2026-02-01',
                    '2026-03-01',
                    '2026-04-01',
                ],
            },
            {
                user_id: userId,
                category_id: 4,
                amount: 2500,
                type: 'expense',
                description: 'Internet bill',
                merchant: 'ISP Provider',
                payment_method: 'bKash',
                dates: [
                    '2025-11-05',
                    '2025-12-05',
                    '2026-01-05',
                    '2026-02-05',
                    '2026-03-05',
                    '2026-04-05',
                ],
            },
            {
                user_id: userId,
                category_id: 14,
                amount: 250,
                type: 'expense',
                description: 'Google Drive storage',
                merchant: 'Google',
                payment_method: 'Credit Card',
                dates: [
                    '2025-11-20',
                    '2025-12-20',
                    '2026-01-20',
                    '2026-02-20',
                    '2026-03-20',
                    '2026-04-20',
                ],
            },
        ];
        let totalCreated = 0;
        for (const sub of subscriptionTransactions) {
            for (const date of sub.dates) {
                await Transaction_1.TransactionModel.create({
                    user_id: sub.user_id,
                    category_id: sub.category_id,
                    amount: sub.amount,
                    type: sub.type,
                    description: sub.description,
                    merchant: sub.merchant,
                    payment_method: sub.payment_method,
                    transaction_date: date,
                });
                totalCreated++;
            }
        }
        console.log(`✅ Created ${totalCreated} subscription transactions`);
        console.log('🔍 Running subscription detection...');
        const result = await subscriptionDetector_1.SubscriptionDetectorService.detectSubscriptions(userId);
        console.log('\n📊 Subscription Detection Results:');
        console.log('==========================================');
        console.log(`New subscriptions detected: ${result.new_subscriptions}`);
        console.log(`Updated subscriptions: ${result.updated_subscriptions}`);
        console.log('==========================================\n');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding subscription data:', error);
        process.exit(1);
    }
}
seedSubscriptionData();
//# sourceMappingURL=seedSubscriptionData.js.map