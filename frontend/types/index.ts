export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  currency: string;
  timezone: string;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
  keywords?: string[];
  is_system: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id?: number;
  amount: number;
  type: 'expense' | 'income';
  description?: string;
  merchant?: string;
  payment_method?: string;
  transaction_date: string;
  is_recurring: boolean;
  subscription_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  merchant: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category_id?: number;
  next_billing_date?: string;
  last_transaction_date?: string;
  is_active: boolean;
  confidence_score?: number;
  detected_at: string;
  cancelled_at?: string;
  notes?: string;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
}

export interface MonthlySummary {
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  transaction_count: number;
  average_daily_expense: number;
  top_expense_category?: {
    id: number;
    name: string;
    amount: number;
    percentage: number;
  };
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
  average_amount: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}