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
export interface SpendingTrend {
    month: string;
    total_income: number;
    total_expenses: number;
    net_savings: number;
    transaction_count: number;
}
export interface TopMerchant {
    amount: any;
    merchant: string;
    total_amount: number;
    transaction_count: number;
    average_amount: number;
    most_common_category?: string;
}
export declare class AnalyticsService {
    static getMonthlySummary(userId: number, month: number, year: number): Promise<MonthlySummary>;
    static getCategoryBreakdown(userId: number, startDate?: string, endDate?: string, type?: 'expense' | 'income'): Promise<CategoryBreakdown[]>;
    static getSpendingTrends(userId: number, months?: number): Promise<SpendingTrend[]>;
    static getTopMerchants(userId: number, limit?: number, startDate?: string, endDate?: string): Promise<TopMerchant[]>;
    static getIncomeVsExpense(userId: number, startDate: string, endDate: string): Promise<{
        total_income: number;
        total_expenses: number;
        net_savings: number;
        savings_rate: number;
    }>;
}
//# sourceMappingURL=analyticsService.d.ts.map