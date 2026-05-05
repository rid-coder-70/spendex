import { Transaction } from '../types';
export declare class TransactionModel {
    static create(data: {
        user_id: number;
        category_id?: number;
        amount: number;
        type: 'expense' | 'income';
        description?: string;
        merchant?: string;
        payment_method?: string;
        transaction_date: string;
        notes?: string;
    }): Promise<Transaction>;
    static findByUser(userId: number, options?: {
        page?: number;
        limit?: number;
        type?: 'expense' | 'income';
        category_id?: number;
        start_date?: string;
        end_date?: string;
        merchant?: string;
    }): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    static findById(id: number, userId: number): Promise<Transaction | null>;
    static update(id: number, userId: number, updates: Partial<Transaction>): Promise<Transaction | null>;
    static delete(id: number, userId: number): Promise<boolean>;
    static getSummary(userId: number, month: number, year: number): Promise<{
        total_income: number;
        total_expenses: number;
        net_savings: number;
        transaction_count: number;
    }>;
}
//# sourceMappingURL=Transaction.d.ts.map