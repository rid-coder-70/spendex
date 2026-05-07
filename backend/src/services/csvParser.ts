import Papa from 'papaparse';
import fs from 'fs';
import { parse, isValid, format } from 'date-fns';

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

export class CSVParserService {
  private static acceptedHeaders = {
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

  static async parseCSV(filePath: string): Promise<CSVParseResult> {
    return new Promise((resolve) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      Papa.parse<CSVRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          return header.toLowerCase().trim();
        },
        complete: (results) => {
          const validTransactions: ParsedTransaction[] = [];
          const errors: Array<{ row: number; data: CSVRow; error: string }> =
            [];

          results.data.forEach((row, index) => {
            const rowNumber = index + 2;

            try {
              const transaction = this.validateAndParseRow(row, rowNumber);
              validTransactions.push(transaction);
            } catch (error: any) {
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
        error: (error: { message: any; }) => {
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

  private static validateAndParseRow(
    row: CSVRow,
    rowNumber: number
  ): ParsedTransaction {
    const errors: string[] = [];

    const dateValue = this.extractValue(row, this.acceptedHeaders.date);
    const amountValue = this.extractValue(row, this.acceptedHeaders.amount);
    const typeValue = this.extractValue(row, this.acceptedHeaders.type);
    const descriptionValue = this.extractValue(
      row,
      this.acceptedHeaders.description
    );
    const merchantValue = this.extractValue(
      row,
      this.acceptedHeaders.merchant
    );
    const paymentMethodValue = this.extractValue(
      row,
      this.acceptedHeaders.payment_method
    );
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
    if (
      typeValue &&
      normalizedType !== 'expense' &&
      normalizedType !== 'income'
    ) {
      errors.push(
        `Invalid type: ${typeValue}. Must be "expense" or "income"`
      );
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    return {
      amount: parsedAmount,
      type: normalizedType as 'expense' | 'income',
      description: descriptionValue || undefined,
      merchant: merchantValue || undefined,
      payment_method: paymentMethodValue || undefined,
      transaction_date: parsedDate!,
      notes: notesValue || undefined,
    };
  }

  private static extractValue(
    row: CSVRow,
    possibleHeaders: string[]
  ): string | undefined {
    for (const header of possibleHeaders) {
      const value = (row as any)[header];
      if (value !== undefined && value !== null && value !== '') {
        return String(value).trim();
      }
    }
    return undefined;
  }

  private static parseDate(dateStr: string): string | null {
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
        const parsed = parse(dateStr, formatStr, new Date());
        if (isValid(parsed)) {
          return format(parsed, 'yyyy-MM-dd');
        }
      } catch (error) {
        continue;
      }
    }

    const isoDate = new Date(dateStr);
    if (isValid(isoDate)) {
      return format(isoDate, 'yyyy-MM-dd');
    }

    return null;
  }
  static generateTemplate(): string {
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