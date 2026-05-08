# ⚙️ SpendGuard — Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql)](https://postgresql.org)

The **Node.js + Express 5 + TypeScript** REST API backend for SpendGuard. Handles authentication, transactions, subscriptions, analytics, CSV parsing, and email reporting — backed by PostgreSQL 17.

---

## 📋 Prerequisites

- **Node.js** v18+
- **npm** v9+
- **PostgreSQL 17** running on port **5433**
- Database `spendguard` created and schema applied

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and fill in your values (see [Environment Variables](#️-environment-variables) below).

### 3. Set Up the Database
```bash
# Create the database
PGPASSWORD=your_password psql -h localhost -p 5433 -U postgres \
  -c "CREATE DATABASE spendguard;"

# Apply the schema (tables + triggers)
PGPASSWORD=your_password psql -h localhost -p 5433 -U postgres \
  -d spendguard -f ../database/schema.sql
```

### 4. Run the Development Server
```bash
npm run dev
```

The server starts with a banner:
```
╔═══════════════════════════════════════╗
║     💰 SpendGuard API Server         ║
║     Environment: development         ║
║     Port: 5000                       ║
║     URL: http://localhost:5000       ║
╚═══════════════════════════════════════╝
```

### 5. Verify
```bash
curl http://localhost:5000/api/health
# {"success":true,"message":"SpendGuard API is running",...}

curl http://localhost:5000/api/health/db
# {"success":true,"message":"Database connected",...}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Entry point — starts HTTP server, graceful shutdown
│   ├── app.ts                 # Express app — middleware, routes, error handlers
│   ├── config/
│   │   └── database.ts        # PostgreSQL Pool + named query() helper
│   ├── controllers/           # Route handler business logic
│   │   ├── analyticsController.ts    # Analytics endpoints
│   │   ├── authController.ts         # Authentication logic
│   │   ├── categoryController.ts     # Category management
│   │   ├── subscriptionController.ts # Subscription CRUD & detection
│   │   ├── transactionController.ts  # Transaction operations
│   │   └── uploadController.ts       # CSV upload handling
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.ts         # JWT authentication guard
│   │   ├── uploadMiddleware.ts       # Multer file upload
│   │   └── validation.ts             # Request validation
│   ├── models/                # Data access layer / query builders
│   │   ├── Category.ts        # Category model
│   │   ├── Transaction.ts     # Transaction model
│   │   ├── UploadHistory.ts   # Upload audit model
│   │   └── User.ts            # User model
│   ├── routes/                # Express Router definitions
│   │   ├── analyticsRoutes.ts # Analytics API routes
│   │   ├── authRoutes.ts      # Authentication routes
│   │   ├── categoryRoutes.ts  # Category routes
│   │   ├── subscriptionRoutes.ts # Subscription routes
│   │   ├── transactionRoutes.ts # Transaction routes
│   │   └── uploadRoutes.ts    # Upload routes
│   ├── services/              # Business logic services
│   │   ├── analyticsService.ts      # Analytics calculations
│   │   ├── csvParser.ts             # CSV processing
│   │   ├── subscriptionDetector.ts  # Recurring pattern detection
│   │   └── utils/                   # Service utilities
│   ├── jobs/                  # Node-Cron scheduled tasks (in progress)
│   ├── scripts/               # Database seeding scripts
│   │   ├── seedSubscriptionData.ts # Generate test subscriptions
│   │   └── seedTestData.ts          # Generate test transactions
│   ├── utils/                 # Shared helper utilities
│   │   ├── jwt.ts             # JWT token utilities
│   │   ├── password.ts        # Password hashing
│   │   └── validation.ts      # Validation helpers
│   └── types/
│       └── express.d.ts       # Extends Express Request with req.user
├── tests/                     # Test suite (in progress)
├── .env                       # Local environment variables (git-ignored)
├── .env.example               # Template for required variables
├── package.json
├── tsconfig.json
└── server.ts                  # Root-level alias for entry point
```

---

## 🔧 Core Services

### Analytics Service (`analyticsService.ts`)
Provides comprehensive financial analytics including:
- Monthly summaries (income, expenses, savings)
- Category-wise spending breakdowns with percentages
- Multi-month spending trends
- Top merchants analysis
- Income vs expense comparisons

### Subscription Detector (`subscriptionDetector.ts`)
Automatically identifies recurring transactions:
- Groups transactions by merchant and amount
- Calculates intervals and consistency
- Determines frequency (daily/weekly/monthly/yearly)
- Assigns confidence scores (0-1)
- Predicts next billing dates

### CSV Parser (`csvParser.ts`)
Handles bulk transaction imports:
- Validates CSV format and headers
- Auto-categorizes transactions using keywords
- Batch inserts with error tracking
- Returns detailed import statistics

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP server port |
| `NODE_ENV` | `development` | Runtime environment |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5433` | PostgreSQL port (PG17 default on this system) |
| `DB_NAME` | `spendguard` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | — | Database password **(required)** |
| `JWT_SECRET` | — | JWT signing secret **(required, keep secret)** |
| `JWT_EXPIRE` | `7d` | JWT token expiry |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_SECURE` | `false` | Use TLS |
| `EMAIL_USER` | — | SMTP username |
| `EMAIL_PASSWORD` | — | SMTP app password |
| `MAX_FILE_SIZE` | `5242880` | Max CSV upload size (bytes) |
| `ALLOWED_FILE_TYPES` | `text/csv,...` | Accepted MIME types |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin |

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `express` | 5.x | HTTP server & routing |
| `typescript` | 6.x | Static types |
| `pg` | 8.x | PostgreSQL client (connection pool) |
| `jsonwebtoken` | 9.x | JWT creation & verification |
| `bcryptjs` | 3.x | Password hashing |
| `multer` | 2.x | Multipart file upload (CSV) |
| `csv-parser` | 3.x | Stream-based CSV parsing |
| `papaparse` | 5.x | CSV parsing (alternative) |
| `express-validator` | 7.x | Request body validation |
| `nodemailer` | 8.x | Transactional email |
| `node-cron` | 4.x | Scheduled background jobs |
| `helmet` | 8.x | HTTP security headers |
| `cors` | 2.x | Cross-Origin Resource Sharing |
| `dotenv` | 17.x | `.env` file loader |
| `nodemon` + `ts-node` | Dev | Hot-reload development |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start production server (requires build) |
| `npm run seed:test-data` | Generate sample transactions |
| `npm run seed:subscriptions` | Generate sample subscriptions |
| `npm test` | Run test suite |

---

## 🔌 API Endpoints

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### 🏥 Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server alive check |
| `GET` | `/api/health/db` | Public | PostgreSQL connectivity |

### 🔐 Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, receive JWT |
| `GET` | `/api/auth/me` | Protected | Current user profile |

### 💳 Transactions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Protected | Paginated list with filters (type, category, date, merchant) |
| `POST` | `/api/transactions` | Protected | Create transaction (auto-categorized) |
| `GET` | `/api/transactions/:id` | Protected | Get single |
| `PUT` | `/api/transactions/:id` | Protected | Update |
| `DELETE` | `/api/transactions/:id` | Protected | Delete |
| `POST` | `/api/transactions/upload` | Protected | CSV bulk import *(Week 4)* |

### 🏷️ Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Protected | List all (filterable by type) |
| `GET` | `/api/categories/:id` | Protected | Get single |
| `POST` | `/api/categories` | Protected | Create custom category |

### ⭐ Subscriptions *(in progress)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/subscriptions` | List active |
| `PUT` | `/api/subscriptions/:id` | Update |
| `POST` | `/api/subscriptions/detect` | Run auto-detection |

### 📊 Analytics *(in progress)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Monthly totals |
| `GET` | `/api/analytics/category-breakdown` | Spend by category |
| `GET` | `/api/analytics/spending-trends` | Multi-month trend |

### 📄 Reports *(in progress)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/monthly` | Full monthly report |
| `POST` | `/api/reports/email` | Email report |

---

## 📈 Week 2 Summary - Authentication System

### ✅ Completed Tasks
- **User Model:** CRUD operations for users, email existence check, optimized DB queries
- **Utilities:** Password hashing (bcrypt), strength validation, JWT generation/verification, email/phone validation, string sanitization
- **Middleware:** Auth middleware, Validation middleware (register/login), error handling
- **Controllers & Routes:** AuthController (register, login, getMe), Auth routes configured & integrated
- **Testing:** Manual API testing completed via Postman collection, endpoints verified

---

## 📈 Week 3 Summary - Transaction Management

### ✅ Completed Tasks

#### Transaction System
- Transaction model with full CRUD operations
- Pagination support (`page`, `limit` query params)
- Advanced filtering: by type (expense/income), category, date range, merchant
- Auto-categorization based on category keywords
- Transaction summary calculation

#### Category System
- Category model
- Get all categories (with optional type filter)
- Get single category by ID
- Create custom categories
- Auto-categorization logic integrated into transaction creation

#### Controllers & Routes
- `TransactionController` — getAll, getOne, create, update, delete
- `CategoryController` — getAll, getOne, create
- Transaction routes with JWT authentication
- Category routes with JWT authentication
- Validation middleware for all inputs

#### Testing
- Test data seed script (`npm run seed:test`) — fully idempotent (re-runnable)
- 19 system categories seeded
- 10 sample transactions created (8 expense, 2 income)
- Complete Postman collection — all endpoints tested manually

### 🗄️ Database State
| Table | Count |
|---|---|
| Users | 2 (john@example.com, test@example.com) |
| Categories | 21 (14 expense, 7 income) |
| Transactions | 10 sample transactions |

### 🔑 Test Credentials
```
Email:    test@example.com
Password: Test123!
```

### � Week 4 Summary - CSV Upload & Processing

## Completed Tasks

### ✅ File Upload System
- Multer middleware configured
- File type validation (CSV only)
- File size limit (5MB)
- Unique filename generation
- Automatic file cleanup

### ✅ CSV Parser Service
- Papa Parse integration
- Flexible header matching
- Support for 9+ date formats
- Row-by-row validation
- Comprehensive error reporting

### ✅ Upload Features
- Bulk transaction import
- Auto-categorization during import
- Upload history tracking
- Detailed import summary
- Error reporting per row

### ✅ Error Handling
- Invalid date formats
- Missing required fields
- Invalid amounts (negative, zero, non-numeric)
- Invalid transaction types
- Malformed CSV files
- File size limits
- Wrong file types

### ✅ Controllers & Routes
- Upload controller
- Upload history tracking
- CSV template generator
- Upload routes with authentication

### ✅ Testing
- Sample CSV files created
- Valid and invalid CSV samples
- Manual upload testing
- Error case testing
- Postman collection updated

## API Endpoints Created

### Upload
- POST /api/upload - Upload CSV file
- GET /api/upload/history - Get upload history
- GET /api/upload/history/:id - Get single upload
- GET /api/upload/template - Download CSV template

## CSV Format Supported

### Required Fields:
- date (various formats supported)
- amount (positive number)
- type (expense or income)

### Optional Fields:
- description
- merchant
- payment_method
- notes

### Flexible Headers:
The system accepts variations:
- Date: date, transaction_date, datetime
- Amount: amount, price, value
- And more...

## Features Implemented
1. ✅ CSV file upload
2. ✅ File validation
3. ✅ CSV parsing with Papa Parse
4. ✅ Flexible date format support
5. ✅ Row-by-row validation
6. ✅ Auto-categorization
7. ✅ Bulk transaction import
8. ✅ Upload history tracking
9. ✅ Error reporting
10. ✅ CSV template generation

## Database Summary
- Upload history table utilized
- Sample data: 10+ transactions imported
- Upload records tracked

---

### 📊 Week 5 Summary - Analytics & Subscription Detection

## Completed Tasks

### ✅ Analytics System
- Monthly summary calculations
- Category-wise breakdown with percentages
- Spending trends (last N months)
- Top merchants analysis
- Income vs expense comparison
- Average daily spending
- Savings rate calculation

### ✅ Subscription Detection
- Automatic recurring transaction detection
- Pattern recognition algorithm
- Confidence scoring (0-1 scale)
- Frequency determination (daily/weekly/monthly/yearly)
- Next billing date prediction
- Auto-categorization
- Inactive subscription marking

### ✅ Controllers & Routes
- Analytics controller with 5 endpoints
- Subscription controller with 5 endpoints
- Input validation
- Error handling

### ✅ Testing
- Subscription test data generated
- All analytics endpoints tested
- Subscription detection verified
- Postman collection updated

## API Endpoints Created

### Analytics
- GET /api/analytics/summary - Monthly summary
- GET /api/analytics/category-breakdown - Category analysis
- GET /api/analytics/spending-trends - Spending over time
- GET /api/analytics/top-merchants - Top spending merchants
- GET /api/analytics/income-vs-expense - Income/expense comparison

### Subscriptions
- GET /api/subscriptions - Get all subscriptions
- GET /api/subscriptions/stats - Subscription statistics
- GET /api/subscriptions/:id - Get single subscription
- PUT /api/subscriptions/:id - Update subscription
- POST /api/subscriptions/detect - Trigger detection

## Features Implemented
1. ✅ Monthly financial summaries
2. ✅ Category-wise spending breakdown
3. ✅ Spending trend analysis (6-24 months)
4. ✅ Top merchants identification
5. ✅ Savings rate calculation
6. ✅ Recurring transaction detection
7. ✅ Subscription frequency analysis
8. ✅ Confidence scoring
9. ✅ Next billing date prediction
10. ✅ Subscription cancellation tracking

## Algorithm Highlights

### Subscription Detection Logic:
1. Group transactions by merchant and amount
2. Calculate intervals between transactions
3. Determine average interval and consistency
4. Classify frequency (daily/weekly/monthly/yearly)
5. Calculate confidence score based on:
   - Standard deviation (consistency)
   - Sample size (reliability)
6. Only store subscriptions with confidence >= 60%

### Confidence Scoring:
- Consistency Score: Based on interval regularity
- Sample Score: Based on number of occurrences
- Final Score = (Consistency * 0.7) + (Sample * 0.3)

## Database Summary
- 30+ recurring transactions created
- 5 subscriptions detected
- Test data spans 6 months

## Next Week (Week 6)
- Background jobs (Cron)
- Monthly report generation
- Email notification system
- Report templates (HTML)
- Email service integration
- Scheduled report delivery

---

## 🧩 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start nodemon hot-reload server |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed:test-data` | Seed categories + test user + 10 sample transactions |
| `npm run seed:subscriptions` | Generate sample subscription data |
| `npm run lint` | ESLint type-aware lint |
| `npm run format` | Prettier format all `src/**/*.ts` |

---

## 🗄️ Database Notes

- PostgreSQL 17 runs on **port 5433** on this system (not the default 5432)
- Always connect via TCP (`-h localhost`) to bypass peer authentication:
  ```bash
  PGPASSWORD=your_password psql -h localhost -p 5433 -U postgres -d spendguard
  ```
- The database pool is configured with:
  - `max: 20` connections
  - `idleTimeoutMillis: 30000`
  - `connectionTimeoutMillis: 2000`
- Import the `query` helper (not the default pool) in route files:
  ```ts
  import { query } from '../config/database';
  // ✅ correct — named export wrapping pool.query()

  import pool from '../config/database';
  // pool.query() directly — also valid
  ```

---

## 🔙 Related

- [Frontend README](../frontend/README.md)
- [Main Project README](../README.md)
- [Database Schema](../database/schema.sql)
