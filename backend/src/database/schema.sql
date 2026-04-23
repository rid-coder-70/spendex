-- SpendGuard Database Schema
-- Run this file to create all tables

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'BDT',
    timezone VARCHAR(50) DEFAULT 'Asia/Dhaka',
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(10) CHECK (type IN ('expense', 'income', 'both')),
    icon VARCHAR(10) DEFAULT '📦',
    color VARCHAR(20) DEFAULT '#6366f1',
    keywords TEXT[] DEFAULT '{}',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    merchant VARCHAR(255),
    payment_method VARCHAR(50),
    transaction_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    subscription_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    merchant VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2),
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    next_billing_date DATE,
    last_transaction_date DATE,
    is_active BOOLEAN DEFAULT true,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    detected_at TIMESTAMP DEFAULT NOW()
);

-- 5. MONTHLY_REPORTS TABLE
CREATE TABLE IF NOT EXISTS monthly_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    total_income DECIMAL(15,2) DEFAULT 0,
    total_expenses DECIMAL(15,2) DEFAULT 0,
    net_savings DECIMAL(15,2) DEFAULT 0,
    generated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- 6. UPLOAD_HISTORY TABLE
CREATE TABLE IF NOT EXISTS upload_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    rows_processed INTEGER DEFAULT 0,
    rows_imported INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- SEED: Default System Categories
INSERT INTO categories (name, type, icon, color, keywords, is_system) VALUES
    ('Food & Dining', 'expense', '🍔', '#f59e0b', ARRAY['food', 'restaurant', 'cafe', 'dining', 'lunch', 'dinner'], true),
    ('Transportation', 'expense', '🚗', '#3b82f6', ARRAY['uber', 'taxi', 'bus', 'fuel', 'petrol', 'rickshaw'], true),
    ('Shopping', 'expense', '🛍️', '#ec4899', ARRAY['shop', 'mall', 'store', 'amazon', 'daraz', 'market'], true),
    ('Healthcare', 'expense', '🏥', '#ef4444', ARRAY['doctor', 'hospital', 'medicine', 'pharmacy', 'clinic'], true),
    ('Entertainment', 'expense', '🎮', '#8b5cf6', ARRAY['netflix', 'youtube', 'spotify', 'cinema', 'game'], true),
    ('Utilities', 'expense', '⚡', '#06b6d4', ARRAY['electricity', 'water', 'gas', 'internet', 'bill'], true),
    ('Education', 'expense', '📚', '#10b981', ARRAY['school', 'tuition', 'course', 'books', 'university'], true),
    ('Rent & Housing', 'expense', '🏠', '#f97316', ARRAY['rent', 'house', 'apartment', 'flat', 'maintenance'], true),
    ('Salary', 'income', '💼', '#22c55e', ARRAY['salary', 'wages', 'paycheck', 'income'], true),
    ('Freelance', 'income', '💻', '#6366f1', ARRAY['freelance', 'contract', 'project', 'fiverr', 'upwork'], true),
    ('Investment', 'income', '📈', '#14b8a6', ARRAY['dividend', 'interest', 'stock', 'returns', 'profit'], true),
    ('Miscellaneous', 'both', '📦', '#64748b', ARRAY['other', 'misc', 'general'], true)
ON CONFLICT (name) DO NOTHING;
