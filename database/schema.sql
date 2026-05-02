-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  currency VARCHAR(3) DEFAULT 'BDT',
  timezone VARCHAR(50) DEFAULT 'Asia/Dhaka',
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('expense', 'income')) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(7),
  keywords TEXT[],
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_type ON categories(type);

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('expense', 'income')) NOT NULL,
  description TEXT,
  merchant VARCHAR(150),
  payment_method VARCHAR(50),
  transaction_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  subscription_id INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant VARCHAR(150) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  next_billing_date DATE,
  last_transaction_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  confidence_score DECIMAL(3, 2),
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP,
  notes TEXT
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id, is_active);

-- Monthly Reports Table
CREATE TABLE monthly_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  total_income DECIMAL(12, 2) DEFAULT 0,
  total_expenses DECIMAL(12, 2) DEFAULT 0,
  net_savings DECIMAL(12, 2) DEFAULT 0,
  top_category_id INTEGER REFERENCES categories(id),
  top_category_amount DECIMAL(12, 2),
  transaction_count INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month, year)
);

CREATE INDEX idx_monthly_reports_user_year ON monthly_reports(user_id, year, month);

-- Upload History Table
CREATE TABLE upload_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER,
  rows_processed INTEGER,
  rows_imported INTEGER,
  rows_failed INTEGER,
  status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_upload_history_user_id ON upload_history(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();