# Sample CSV Files

## sample_transactions.csv
- Contains 10 valid transactions
- Mix of expense and income
- Different payment methods
- Properly formatted dates

## sample_with_errors.csv
- Contains mix of valid and invalid transactions
- Used for testing error handling
- Demonstrates common CSV errors:
  - Invalid date format
  - Missing required fields
  - Negative amounts
  - Invalid transaction type
  - Missing date

## CSV Format

### Required Columns:
- `date` - Transaction date (YYYY-MM-DD format preferred)
- `amount` - Transaction amount (positive number)
- `type` - Transaction type ("expense" or "income")

### Optional Columns:
- `description` - Transaction description
- `merchant` - Merchant/vendor name
- `payment_method` - Payment method used
- `notes` - Additional notes

### Supported Date Formats:
- 2025-01-21 (YYYY-MM-DD)
- 01/21/2025 (MM/DD/YYYY)
- 21/01/2025 (DD/MM/YYYY)
- 21-01-2025 (DD-MM-YYYY)
- And more...

### Flexible Headers:
The system accepts variations of column names:
- Date: date, transaction_date, datetime
- Amount: amount, price, value, total
- Type: type, transaction_type
- Description: description, details, memo
- Merchant: merchant, vendor, store, payee
- Payment Method: payment_method, payment_type, method