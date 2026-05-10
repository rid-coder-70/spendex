export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    phone?: string;
    currency: string;
    timezone: string;
    email_notifications: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Category {
    id: number;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    keywords?: string[];
    is_system: boolean;
    created_at: Date;
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
    transaction_date: Date;
    is_recurring: boolean;
    subscription_id?: number;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}
export interface Subscription {
    id: number;
    user_id: number;
    merchant: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    category_id?: number;
    next_billing_date?: Date;
    last_transaction_date?: Date;
    is_active: boolean;
    confidence_score?: number;
    detected_at: Date;
    cancelled_at?: Date;
    notes?: string;
}
export interface MonthlyReport {
    id: number;
    user_id: number;
    month: number;
    year: number;
    total_income: number;
    total_expenses: number;
    net_savings: number;
    top_category_id?: number;
    top_category_amount?: number;
    transaction_count: number;
    generated_at: Date;
}
export interface UploadHistory {
    id: number;
    user_id: number;
    filename: string;
    file_size?: number;
    rows_processed?: number;
    rows_imported?: number;
    rows_failed?: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message?: string;
    uploaded_at: Date;
}
export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map