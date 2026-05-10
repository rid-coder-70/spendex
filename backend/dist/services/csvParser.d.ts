export interface CSVRow {
    date?: string;
    description?: string;
    amount?: string;
    type?: string;
    merchant?: string;
    payment_method?: string;
    category?: string;
    notes?: string;
}
export interface ParsedTransaction {
    amount: number;
    type: 'expense' | 'income';
    description?: string;
    merchant?: string;
    payment_method?: string;
    transaction_date: string;
    notes?: string;
    category_id?: number;
}
export interface CSVParseResult {
    success: boolean;
    totalRows: number;
    validTransactions: ParsedTransaction[];
    errors: Array<{
        row: number;
        data: CSVRow;
        error: string;
    }>;
}
export declare class CSVParserService {
    private static acceptedHeaders;
    static parseCSV(filePath: string): Promise<CSVParseResult>;
    private static validateAndParseRow;
    private static extractValue;
    private static parseDate;
    static generateTemplate(): string;
}
//# sourceMappingURL=csvParser.d.ts.map