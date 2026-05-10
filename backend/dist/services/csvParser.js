"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVParserService = void 0;
const papaparse_1 = __importDefault(require("papaparse"));
const fs_1 = __importDefault(require("fs"));
const date_fns_1 = require("date-fns");
class CSVParserService {
    static async parseCSV(filePath) {
        return new Promise((resolve) => {
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            papaparse_1.default.parse(fileContent, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => {
                    return header.toLowerCase().trim();
                },
                complete: (results) => {
                    const validTransactions = [];
                    const errors = [];
                    results.data.forEach((row, index) => {
                        const rowNumber = index + 2;
                        try {
                            const transaction = this.validateAndParseRow(row, rowNumber);
                            validTransactions.push(transaction);
                        }
                        catch (error) {
                            errors.push({
                                row: rowNumber,
                                data: row,
                                error: error.message,
                            });
                        }
                    });
                    resolve({
                        success: true,
                        totalRows: results.data.length,
                        validTransactions,
                        errors,
                    });
                },
                error: (error) => {
                    resolve({
                        success: false,
                        totalRows: 0,
                        validTransactions: [],
                        errors: [
                            {
                                row: 0,
                                data: {},
                                error: `CSV parsing failed: ${error.message}`,
                            },
                        ],
                    });
                },
            });
        });
    }
    static validateAndParseRow(row, rowNumber) {
        const errors = [];
        const dateValue = this.extractValue(row, this.acceptedHeaders.date);
        const amountValue = this.extractValue(row, this.acceptedHeaders.amount);
        const typeValue = this.extractValue(row, this.acceptedHeaders.type);
        const descriptionValue = this.extractValue(row, this.acceptedHeaders.description);
        const merchantValue = this.extractValue(row, this.acceptedHeaders.merchant);
        const paymentMethodValue = this.extractValue(row, this.acceptedHeaders.payment_method);
        const notesValue = this.extractValue(row, this.acceptedHeaders.notes);
        if (!dateValue) {
            errors.push('Date is required');
        }
        const parsedDate = dateValue ? this.parseDate(dateValue) : null;
        if (dateValue && !parsedDate) {
            errors.push(`Invalid date format: ${dateValue}`);
        }
        if (!amountValue) {
            errors.push('Amount is required');
        }
        const parsedAmount = amountValue ? parseFloat(amountValue) : NaN;
        if (amountValue && (isNaN(parsedAmount) || parsedAmount <= 0)) {
            errors.push(`Invalid amount: ${amountValue}`);
        }
        if (!typeValue) {
            errors.push('Type is required (expense or income)');
        }
        const normalizedType = typeValue?.toLowerCase().trim();
        if (typeValue &&
            normalizedType !== 'expense' &&
            normalizedType !== 'income') {
            errors.push(`Invalid type: ${typeValue}. Must be "expense" or "income"`);
        }
        if (errors.length > 0) {
            throw new Error(errors.join('; '));
        }
        return {
            amount: parsedAmount,
            type: normalizedType,
            description: descriptionValue || undefined,
            merchant: merchantValue || undefined,
            payment_method: paymentMethodValue || undefined,
            transaction_date: parsedDate,
            notes: notesValue || undefined,
        };
    }
    static extractValue(row, possibleHeaders) {
        for (const header of possibleHeaders) {
            const value = row[header];
            if (value !== undefined && value !== null && value !== '') {
                return String(value).trim();
            }
        }
        return undefined;
    }
    static parseDate(dateStr) {
        const formats = [
            'yyyy-MM-dd',
            'MM/dd/yyyy',
            'dd/MM/yyyy',
            'dd-MM-yyyy',
            'MM-dd-yyyy',
            'yyyy/MM/dd',
            'dd.MM.yyyy',
            'MMM dd, yyyy',
            'dd MMM yyyy',
        ];
        for (const formatStr of formats) {
            try {
                const parsed = (0, date_fns_1.parse)(dateStr, formatStr, new Date());
                if ((0, date_fns_1.isValid)(parsed)) {
                    return (0, date_fns_1.format)(parsed, 'yyyy-MM-dd');
                }
            }
            catch (error) {
                continue;
            }
        }
        const isoDate = new Date(dateStr);
        if ((0, date_fns_1.isValid)(isoDate)) {
            return (0, date_fns_1.format)(isoDate, 'yyyy-MM-dd');
        }
        return null;
    }
    static generateTemplate() {
        const headers = [
            'date',
            'description',
            'amount',
            'type',
            'merchant',
            'payment_method',
            'notes',
        ];
        const sampleRows = [
            [
                '2025-01-21',
                'Lunch at restaurant',
                '1500.00',
                'expense',
                'Pizza Hut',
                'bKash',
                'Team lunch',
            ],
            [
                '2025-01-20',
                'Freelance project payment',
                '15000.00',
                'income',
                'Client ABC',
                'Bank Transfer',
                'Project completed',
            ],
            [
                '2025-01-19',
                'Grocery shopping',
                '3500.00',
                'expense',
                'Shwapno',
                'Cash',
                'Weekly groceries',
            ],
        ];
        let csv = headers.join(',') + '\n';
        sampleRows.forEach((row) => {
            csv += row.join(',') + '\n';
        });
        return csv;
    }
}
exports.CSVParserService = CSVParserService;
CSVParserService.acceptedHeaders = {
    date: ['date', 'transaction_date', 'transaction date', 'datetime'],
    amount: ['amount', 'price', 'value', 'total'],
    type: ['type', 'transaction_type', 'category type'],
    description: ['description', 'details', 'memo', 'note'],
    merchant: ['merchant', 'vendor', 'store', 'shop', 'payee'],
    payment_method: [
        'payment_method',
        'payment method',
        'method',
        'payment_type',
        'payment type',
    ],
    notes: ['notes', 'remarks', 'comment', 'comments'],
};
//# sourceMappingURL=csvParser.js.map