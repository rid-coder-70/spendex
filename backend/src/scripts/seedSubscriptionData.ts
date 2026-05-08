import { TransactionModel } from '../models/Transaction';
import { SubscriptionDetectorService } from '../services/subscriptionDetector';
import dotenv from 'dotenv';

dotenv.config();

async function seedSubscriptionData() {
  try {
    console.log('🌱 Seeding subscription test data...');

    const userId = 1; 


    const subscriptionTransactions = [
      {
        user_id: userId,
        category_id: 3,
        amount: 799,
        type: 'expense' as const,
        description: 'Netflix subscription',
        merchant: 'Netflix',
        payment_method: 'Credit Card',
        dates: [
          '2024-08-15',
          '2024-09-15',
          '2024-10-15',
          '2024-11-15',
          '2024-12-15',
          '2025-01-15',
        ],
      },
      {
        user_id: userId,
        category_id: 3,
        amount: 399,
        type: 'expense' as const,
        description: 'Spotify Premium',
        merchant: 'Spotify',
        payment_method: 'Credit Card',
        dates: [
          '2024-08-10',
          '2024-09-10',
          '2024-10-10',
          '2024-11-10',
          '2024-12-10',
          '2025-01-10',
        ],
      },
      {
        user_id: userId,
        category_id: 13, 
        amount: 3000,
        type: 'expense' as const,
        description: 'Gym membership',
        merchant: 'Fitness First',
        payment_method: 'bKash',
        dates: [
          '2024-08-01',
          '2024-09-01',
          '2024-10-01',
          '2024-11-01',
          '2024-12-01',
          '2025-01-01',
        ],
      },
      {
        user_id: userId,
        category_id: 4, 
        amount: 2500,
        type: 'expense' as const,
        description: 'Internet bill',
        merchant: 'ISP Provider',
        payment_method: 'bKash',
        dates: [
          '2024-08-05',
          '2024-09-05',
          '2024-10-05',
          '2024-11-05',
          '2024-12-05',
          '2025-01-05',
        ],
      },
      {
        user_id: userId,
        category_id: 14,
        amount: 250,
        type: 'expense' as const,
        description: 'Google Drive storage',
        merchant: 'Google',
        payment_method: 'Credit Card',
        dates: [
          '2024-08-20',
          '2024-09-20',
          '2024-10-20',
          '2024-11-20',
          '2024-12-20',
          '2025-01-20',
        ],
      },
    ];

    let totalCreated = 0;

    for (const sub of subscriptionTransactions) {
      for (const date of sub.dates) {
        await TransactionModel.create({
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
    const result = await SubscriptionDetectorService.detectSubscriptions(userId);

    console.log('\n📊 Subscription Detection Results:');
    console.log('==========================================');
    console.log(`New subscriptions detected: ${result.new_subscriptions}`);
    console.log(`Updated subscriptions: ${result.updated_subscriptions}`);
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subscription data:', error);
    process.exit(1);
  }
}

seedSubscriptionData();