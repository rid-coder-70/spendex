interface MonthlyReportData {
    userName: string;
    userEmail: string;
    month: number;
    monthName: string;
    year: number;
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    transactionCount: number;
    topCategories: Array<{
        name: string;
        icon: string;
        amount: number;
        percentage: number;
    }>;
    subscriptions: Array<{
        merchant: string;
        amount: number;
        frequency: string;
        nextBillingDate: Date;
    }>;
    totalSubscriptionCost: number;
    topMerchants: Array<{
        merchant: string;
        totalAmount: number;
    }>;
    insights: string[];
    dashboardUrl: string;
    unsubscribeUrl: string;
}
export declare class ReportService {
    static generateMonthlyReport(userId: number, month: number, year: number): Promise<MonthlyReportData>;
    private static generateInsights;
    static sendMonthlyReportEmail(userId: number, month: number, year: number): Promise<boolean>;
    static sendWelcomeEmail(name: string, email: string): Promise<boolean>;
    static sendMonthlyReportsToAllUsers(month: number, year: number): Promise<{
        total: number;
        sent: number;
        failed: number;
    }>;
}
export {};
//# sourceMappingURL=reportService.d.ts.map