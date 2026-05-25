import { TransactionModel } from '../models/Transaction';
import { PasswordUtils } from '../utils/password';
import { query } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();


async function seedCategories(): Promise<Record<string, number>> {
  const categories = [
    { name: 'Food & Dining',     type: 'expense', icon: '🍔', color: '#FF6B6B' },
    { name: 'Transportation',    type: 'expense', icon: '🚗', color: '#4ECDC4' },
    { name: 'Entertainment',     type: 'expense', icon: '🎬', color: '#45B7D1' },
    { name: 'Utilities',         type: 'expense', icon: '💡', color: '#96CEB4' },
    { name: 'Shopping',          type: 'expense', icon: '🛍️', color: '#FFEAA7' },
    { name: 'Healthcare',        type: 'expense', icon: '🏥', color: '#DDA0DD' },
    { name: 'Education',         type: 'expense', icon: '📚', color: '#98D8C8' },
    { name: 'Groceries',         type: 'expense', icon: '🛒', color: '#F7DC6F' },
    { name: 'Rent & Housing',    type: 'expense', icon: '🏠', color: '#A9CCE3' },
    { name: 'Insurance',         type: 'expense', icon: '🛡️', color: '#D7BDE2' },
    { name: 'Travel',            type: 'expense', icon: '✈️', color: '#A3E4D7' },
    { name: 'Personal Care',     type: 'expense', icon: '💆', color: '#FAD7A0' },
    { name: 'Gifts & Donations', type: 'expense', icon: '🎁', color: '#F1948A' },
    { name: 'Other Expense',     type: 'expense', icon: '💸', color: '#BDC3C7' },
    { name: 'Salary',            type: 'income',  icon: '💼', color: '#2ECC71' },
    { name: 'Freelance',         type: 'income',  icon: '💻', color: '#27AE60' },
    { name: 'Investment',        type: 'income',  icon: '📈', color: '#1ABC9C' },
    { name: 'Business',          type: 'income',  icon: '🏢', color: '#16A085' },
    { name: 'Other Income',      type: 'income',  icon: '💰', color: '#52BE80' },
  ];

  const nameToId: Record<string, number> = {};

  for (const cat of categories) {
    const result = await query(
      `INSERT INTO categories (name, type, icon, color, is_system)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (name) DO UPDATE SET type = EXCLUDED.type
       RETURNING id, name`,
      [cat.name, cat.type, cat.icon, cat.color]
    );
    nameToId[result.rows[0].name] = result.rows[0].id;
  }

  console.log(`Seeded ${categories.length} categories`);
  return nameToId;
}

async function seedTestData() {
  try {
    console.log('Seeding test data...');

    console.log('Creating categories...');
    const catIds = await seedCategories();

    console.log('Creating test user...');
    const password_hash = await PasswordUtils.hash('Test123!');
    await query(
      `INSERT INTO users (name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Test User', 'test@example.com', password_hash, '+8801712345678']
    );
    const userResult = await query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    const user = userResult.rows[0];
    console.log('Test user ready:', user.email);

    console.log('Creating sample transactions...');

    const transactions = [
      {
        user_id: user.id,
        category_id: catIds['Food & Dining'],
        amount: 1500,
        type: 'expense' as const,
        description: 'Lunch at restaurant',
        merchant: 'Pizza Hut',
        payment_method: 'bKash',
        transaction_date: '2025-01-15',
      },
      {
        user_id: user.id,
        category_id: catIds['Transportation'],
        amount: 500,
        type: 'expense' as const,
        description: 'Uber ride to office',
        merchant: 'Uber',
        payment_method: 'Credit Card',
        transaction_date: '2025-01-16',
      },
      {
        user_id: user.id,
        category_id: catIds['Groceries'],
        amount: 3500,
        type: 'expense' as const,
        description: 'Weekly grocery shopping',
        merchant: 'Shwapno',
        payment_method: 'Cash',
        transaction_date: '2025-01-17',
      },
      {
        user_id: user.id,
        category_id: catIds['Utilities'],
        amount: 2500,
        type: 'expense' as const,
        description: 'Internet bill',
        merchant: 'ISP Provider',
        payment_method: 'bKash',
        transaction_date: '2025-01-18',
      },
      {
        user_id: user.id,
        category_id: catIds['Entertainment'],
        amount: 799,
        type: 'expense' as const,
        description: 'Netflix subscription',
        merchant: 'Netflix',
        payment_method: 'Credit Card',
        transaction_date: '2025-01-19',
      },
      {
        user_id: user.id,
        category_id: catIds['Shopping'],
        amount: 4500,
        type: 'expense' as const,
        description: 'New shoes',
        merchant: 'Bata',
        payment_method: 'Credit Card',
        transaction_date: '2025-01-20',
      },
      {
        user_id: user.id,
        category_id: catIds['Salary'],
        amount: 50000,
        type: 'income' as const,
        description: 'Monthly salary',
        merchant: 'Company ABC',
        payment_method: 'Bank Transfer',
        transaction_date: '2025-01-01',
      },
      {
        user_id: user.id,
        category_id: catIds['Freelance'],
        amount: 15000,
        type: 'income' as const,
        description: 'Freelance project payment',
        merchant: 'Client XYZ',
        payment_method: 'bKash',
        transaction_date: '2025-01-10',
      },
      {
        user_id: user.id,
        category_id: catIds['Food & Dining'],
        amount: 2000,
        type: 'expense' as const,
        description: 'Dinner with friends',
        merchant: 'KFC',
        payment_method: 'Cash',
        transaction_date: '2024-12-25',
      },
      {
        user_id: user.id,
        category_id: catIds['Salary'],
        amount: 50000,
        type: 'income' as const,
        description: 'Monthly salary',
        merchant: 'Company ABC',
        payment_method: 'Bank Transfer',
        transaction_date: '2024-12-01',
      },
    ];

    for (const transaction of transactions) {
      await TransactionModel.create(transaction);
    }

    console.log(`Created ${transactions.length} sample transactions`);
    console.log('\n Test Data Summary:');
    console.log('==========================================');
    console.log('Email: test@example.com');
    console.log('Password: Test123!');
    console.log('Transactions: 10 (8 expenses, 2 income)');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
}

seedTestData();