<div align="center">

# 🛡️ SpendGuard
### Personal Finance Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Track income, expenses, subscriptions, and gain smart financial insights — all in one place.**

[🚀 Get Started](#-getting-started) · [📐 Architecture](#-system-architecture) · [🗄️ Database](#️-database-design) · [🔌 API](#-api-reference) · [✅ Progress](#-current-progress)

</div>

---

## 📖 Overview

SpendGuard is a full-stack personal finance management system built with **Next.js + TypeScript** on the frontend and **Node.js + Express + PostgreSQL** on the backend. It helps you:

- 📊 **Track** every income and expense with categories
- 📤 **Import** bank statements via CSV upload
- 🔄 **Detect** recurring subscriptions automatically
- 📈 **Visualise** spending trends with rich analytics charts
- 📧 **Receive** monthly financial reports via email
- 🔐 **Secure** all data with JWT authentication

### Key Features
- **Monthly Analytics**: Income/expense summaries, category breakdowns, spending trends
- **Subscription Detection**: Automatic recurring payment identification with confidence scoring
- **CSV Import**: Bulk transaction upload with auto-categorization
- **Category Management**: System and custom categories with icons and colors
- **Secure Authentication**: JWT-based user authentication and authorization

---

## 📐 System Architecture

The system follows a classic **3-layer architecture**:

| Layer | Technology | Port |
|---|---|---|
| Client (Frontend) | Next.js 16 + TypeScript + Recharts + Tailwind CSS | 3000 |
| Application (Backend) | Node.js + Express 5 + TypeScript | 5000 |
| Data (Database) | PostgreSQL 17 | 5433 |

Background jobs (Node-Cron) handle: Monthly Report Generation, Subscription Detection, Email Scheduling.

---

## 🗄️ Database Design

SpendGuard uses **6 inter-related PostgreSQL tables**:

```
USERS ──────────────── TRANSACTIONS ─── CATEGORIES
  │                         │
  ├── SUBSCRIPTIONS          ├── MONTHLY_REPORTS
  └── UPLOAD_HISTORY
```

| Table | Purpose |
|---|---|
| `users` | Auth, profile, currency (BDT) & timezone (Asia/Dhaka) preferences |
| `transactions` | Income & expense records with categories, merchant & payment method |
| `categories` | System + custom labels with icon, color & keyword arrays |
| `subscriptions` | Auto-detected recurring payments with confidence scoring |
| `monthly_reports` | Pre-computed monthly financial summaries (income, expenses, savings) |
| `upload_history` | CSV import audit log with row-level pass/fail tracking |

### Key Schema Details
- UUID extension enabled (`uuid-ossp`)
- Auto-updating `updated_at` via PostgreSQL triggers on `users` and `transactions`
- Cascading deletes: removing a user removes all their data
- All monetary values stored as `DECIMAL(12, 2)`
- Default currency: **BDT**, default timezone: **Asia/Dhaka**

---

## 🔌 API Reference

All endpoints are prefixed with `/api`. Protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

### 🏥 Health Checks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status |
| `GET` | `/api/health/db` | Database connectivity check |

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login (returns JWT) |
| `GET` | `/api/auth/me` | Protected | Get current user |

### 💳 Transactions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | List (paginated, filterable) |
| `POST` | `/api/transactions` | Create transaction |
| `GET` | `/api/transactions/:id` | Get single |
| `PUT` | `/api/transactions/:id` | Update |
| `DELETE` | `/api/transactions/:id` | Delete |
| `POST` | `/api/transactions/upload` | CSV Import |

### 🏷️ Categories
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create custom category |
| `PUT` | `/api/categories/:id` | Update category |
| `DELETE` | `/api/categories/:id` | Delete (non-system only) |

### ⭐ Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/subscriptions` | List active subscriptions |
| `GET` | `/api/subscriptions/stats` | Subscription statistics |
| `GET` | `/api/subscriptions/:id` | Get single subscription |
| `PUT` | `/api/subscriptions/:id` | Update subscription |
| `POST` | `/api/subscriptions/detect` | Trigger auto-detection |

### 📊 Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Monthly income/expense totals |
| `GET` | `/api/analytics/category-breakdown` | Spend per category |
| `GET` | `/api/analytics/spending-trends` | Multi-month trend data |
| `GET` | `/api/analytics/top-merchants` | Top spending merchants |
| `GET` | `/api/analytics/income-vs-expense` | Income/expense comparison |

### 📄 Reports
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/monthly` | Full monthly report |
| `POST` | `/api/reports/email` | Email report to user |

### CSV Upload Flow
```
User selects CSV → POST /api/transactions/upload
  → Validate format → Parse rows → Auto-categorize
  → Batch insert → Return { total, imported, failed }
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v17 (running on port **5433**)
- **npm** v9+

### 1. Clone the Repository
```bash
git clone https://github.com/ridoy-pc/spendex.git
cd spendex
```

### 2. Database Setup
```bash
# Create the database (using sudo -u postgres or PGPASSWORD)
PGPASSWORD=your_password psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE spendguard;"

# Run schema (creates all 6 tables + triggers)
PGPASSWORD=your_password psql -h localhost -p 5433 -U postgres -d spendguard -f database/schema.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DB_PASSWORD, JWT_SECRET, and EMAIL credentials
npm run dev
# ✅ Server running on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
# .env.local already configured → NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
# ✅ App running on http://localhost:3000
```

---

## 📁 Project Structure

```
spendex/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Entry point + graceful shutdown
│   │   ├── app.ts                 # Express app config + middleware
│   │   ├── config/
│   │   │   └── database.ts        # PostgreSQL pool + query helper
│   │   ├── controllers/           # Route handler logic (in progress)
│   │   ├── middleware/            # JWT auth middleware (in progress)
│   │   ├── models/                # Data models (in progress)
│   │   ├── routes/                # API route definitions (in progress)
│   │   ├── services/              # Business logic (in progress)
│   │   ├── jobs/                  # Node-Cron background jobs (in progress)
│   │   ├── utils/                 # Shared utility functions
│   │   └── types/
│   │       └── express.d.ts       # Express Request type augmentation
│   ├── tests/                     # Test suite (in progress)
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx         # Root layout
│       │   ├── page.tsx           # Home page
│       │   └── globals.css        # Global styles + design tokens
│       ├── components/            # Reusable UI components (in progress)
│       ├── contexts/              # React context providers (in progress)
│       ├── hooks/                 # Custom React hooks (in progress)
│       ├── lib/                   # Axios instance + utilities (in progress)
│       ├── styles/                # Additional stylesheets
│       └── types/                 # TypeScript type definitions
├── database/
│   └── schema.sql                 # Full DB schema (6 tables + triggers)
├── docs/
│   └── diagrams/                  # Architecture & DB diagrams
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5433
DB_NAME=spendguard
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Version | Purpose |
|---|---|---|
| Next.js | 16.2.4 | React framework + App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Recharts | 3.x | Analytics charts (area, bar, pie, line) |
| Axios | 1.x | HTTP client with JWT interceptors |
| React Hook Form | 7.x | Form state management |
| Zod | 4.x | Schema validation |
| Zustand | 5.x | Global state management |
| Lucide React | 1.x | Icon library |
| date-fns | 4.x | Date formatting utilities |
| clsx | 2.x | Conditional class names |

### Backend
| Tech | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | HTTP server & REST API |
| TypeScript | 6.x | Type safety |
| PostgreSQL + `pg` | 17 / 8.x | Primary database |
| JWT (`jsonwebtoken`) | 9.x | Authentication tokens |
| bcryptjs | 3.x | Password hashing |
| Multer | 2.x | CSV file upload handling |
| csv-parser + PapaParse | 3.x / 5.x | Parse CSV rows |
| Nodemailer | 8.x | Email notifications |
| Node-Cron | 4.x | Background scheduled jobs |
| express-validator | 7.x | Request validation |
| Helmet + CORS | 8.x / 2.x | Security middleware |
| nodemon + ts-node | Dev | Hot reload development server |

---

## ✅ Current Progress

### Foundation (Complete)
| Task | Status |
|---|---|
| GitHub repository setup | ✅ Done |
| Project structure created | ✅ Done |
| PostgreSQL 17 installed & configured (port 5433) | ✅ Done |
| All 6 database tables created | ✅ Done |
| Auto-update triggers on `users` & `transactions` | ✅ Done |
| Express server with health check endpoints (`/api/health`, `/api/health/db`) | ✅ Done |
| PostgreSQL connection pool with named `query` helper | ✅ Done |
| Graceful shutdown handling (SIGTERM / SIGINT) | ✅ Done |
| Express type augmentation for `req.user` | ✅ Done |
| Next.js 16 frontend scaffold | ✅ Done |
| Global CSS design system | ✅ Done |
| Environment configuration (`.env` / `.env.local`) | ✅ Done |

### Core Auth (Complete)
| Task | Status |
|---|---|
| JWT authentication middleware | ✅ Done |
| Auth routes (register, login, me) | ✅ Done |

### Transaction Management (Complete)
| Task | Status |
|---|---|
| Transaction model with CRUD operations | ✅ Done |
| Pagination support (page, limit) | ✅ Done |
| Filtering by type, category, date range, merchant | ✅ Done |
| Auto-categorization based on keywords | ✅ Done |
| Transaction summary calculation | ✅ Done |
| Category model (get, create, filter by type) | ✅ Done |
| TransactionController & CategoryController | ✅ Done |
| Transaction & Category routes with auth | ✅ Done |
| Validation middleware | ✅ Done |
| Test data seed script (10 sample transactions) | ✅ Done |

### CSV Upload (Complete)
| Task | Status |
|---|---|
| Multer middleware for file upload | ✅ Done |
| CSV parsing with validation | ✅ Done |
| Auto-categorization during import | ✅ Done |
| Upload history tracking | ✅ Done |
| UploadController & routes | ✅ Done |
| Postman collection updated | ✅ Done |

### Analytics System (Complete)
| Task | Status |
|---|---|
| Monthly summary calculations | ✅ Done |
| Category-wise breakdown with percentages | ✅ Done |
| Spending trends (last N months) | ✅ Done |
| Top merchants analysis | ✅ Done |
| Income vs expense comparison | ✅ Done |
| Average daily spending | ✅ Done |
| Savings rate calculation | ✅ Done |
| AnalyticsController with 5 endpoints | ✅ Done |
| Analytics routes configured | ✅ Done |

### Subscription Detection (Complete)
| Task | Status |
|---|---|
| Automatic recurring transaction detection | ✅ Done |
| Pattern recognition algorithm | ✅ Done |
| Confidence scoring (0-1 scale) | ✅ Done |
| Frequency determination (daily/weekly/monthly/yearly) | ✅ Done |
| Next billing date prediction | ✅ Done |
| Auto-categorization | ✅ Done |
| Inactive subscription marking | ✅ Done |
| SubscriptionController with 5 endpoints | ✅ Done |
| Subscription routes configured | ✅ Done |
| Test subscription data generated | ✅ Done |

### Next Steps (Complete)
| Task | Status |
|---|---|
| Background jobs (Node-Cron) | ✅ Done |
| Monthly report generation | ✅ Done  |
| Email notification system | ✅ Done  |
| Report templates (HTML) | ✅ Done  |
| Email service integration | ✅ Done  |
| Scheduled report delivery | ✅ Done  |

### Frontend Setup & Auth (Complete)
| Task | Status |
|---|---|
| Next.js 14 setup with TypeScript | ✅ Done |
| Tailwind CSS with custom theme | ✅ Done |
| State management with Zustand | ✅ Done |
| API client & Auth service layer | ✅ Done |
| Login & Registration pages | ✅ Done |
| Form validation & Protected routes | ✅ Done |

---

### 📈 Week 2 Summary - Authentication System

#### ✅ Completed Tasks
- **User Model:** CRUD operations for users, email existence check, optimized DB queries
- **Utilities:** Password hashing (bcrypt), strength validation, JWT generation/verification, email/phone validation, string sanitization
- **Middleware:** Auth middleware, Validation middleware (register/login), error handling
- **Controllers & Routes:** AuthController (register, login, getMe), Auth routes configured & integrated
- **Testing:** Manual API testing completed via Postman collection, endpoints verified

#### 🔌 API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

---

### 📈 Week 3 Summary - Transaction Management

#### ✅ Completed Tasks
- **Transaction System:** Transaction model with CRUD operations, pagination support, advanced filtering (type, category, date range, merchant), auto-categorization based on keywords, transaction summary calculation
- **Category System:** Category model, get all categories (with type filter), get single category, create custom categories, auto-categorization logic
- **Controllers & Routes:** TransactionController (getAll, getOne, create, update, delete), CategoryController (getAll, getOne, create), transaction & category routes with authentication, validation middleware
- **Testing:** Test data seed script, 10 sample transactions created, complete Postman collection, all endpoints tested manually

#### 🔌 API Endpoints Added
**Transactions**
- `GET /api/transactions` — Get all (paginated, filterable)
- `GET /api/transactions/:id` — Get single
- `POST /api/transactions` — Create
- `PUT /api/transactions/:id` — Update
- `DELETE /api/transactions/:id` — Delete

**Categories**
- `GET /api/categories` — Get all
- `GET /api/categories/:id` — Get single
- `POST /api/categories` — Create custom

#### 🗄️ Database State
- Users: 2 (john@example.com, test@example.com)
- Categories: 21 (14 expense, 7 income)
- Transactions: 10 sample transactions

#### 🔑 Test Credentials
- Email: `test@example.com`
- Password: `Test123!`

### 📈 Week 4 Summary - CSV Upload & Processing

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

## Next Week (Week 5)
- Analytics endpoints
- Monthly summary calculation
- Category-wise breakdown
- Spending trends analysis
- Subscription detection algorithm
- Top merchants report

---

### 📧 Week 6 Summary - Background Jobs & Email Notifications

## Completed Tasks

### ✅ Email System
- Nodemailer integration with Gmail SMTP
- Email configuration validation
- Email service initialization and connection verification
- Handlebars template engine for HTML emails
- Welcome email template with feature highlights
- Monthly report email template with financial data visualization
- Template helpers for currency formatting, date formatting, and percentages
- Error handling and retry logic

### ✅ Report Generation
- Monthly report data aggregation from multiple services
- Automatic insight generation with personalized recommendations
- Previous month comparison for progress tracking
- Savings rate calculation and analysis
- Report controller and routes for manual report generation
- Email delivery integration

### ✅ Background Jobs
- Node-Cron scheduler implementation
- Monthly report job (1st of month at 9:00 AM)
- Subscription detection job (daily at 2:00 AM)
- Manual job triggers for testing
- Graceful shutdown handling with job cleanup
- Job scheduler with start/stop functionality

### ✅ Features Implemented
1. ✅ Automated monthly reports
2. ✅ Email notification system
3. ✅ Welcome emails for new users on registration
4. ✅ Scheduled report delivery
5. ✅ Daily subscription detection
6. ✅ Personalized financial insights
7. ✅ Beautifully designed email templates
8. ✅ Manual job triggers for testing

## API Endpoints Created

### Reports
- GET /api/reports/monthly - Generate report (view only)
- POST /api/reports/send - Send report via email
- POST /api/reports/trigger-monthly-job - Trigger monthly job
- POST /api/reports/trigger-subscription-job - Trigger subscription job

## Email Templates

### Monthly Report Email
- Financial summary (income, expenses, savings)
- Top expense categories with icons and percentages
- Active subscriptions overview with billing dates
- Top merchants by spending
- Personalized insights and recommendations
- Call-to-action button to dashboard
- Unsubscribe link

### Welcome Email
- Personalized greeting with user name
- Feature highlights (transaction tracking, analytics, reports)
- Dashboard quick-start link
- Help center link

## Cron Job Schedules

1. **Monthly Report Job**
   - Schedule: 1st of every month at 9:00 AM
   - Sends reports to all users with notifications enabled
   - Triggered via: `POST /api/reports/trigger-monthly-job` (manual)

2. **Subscription Detection Job**
   - Schedule: Daily at 2:00 AM
   - Detects recurring subscriptions for all users
   - Triggered via: `POST /api/reports/trigger-subscription-job` (manual)

## Configuration

### Environment Variables Added:
- EMAIL_HOST - SMTP server host (default: smtp.gmail.com)
- EMAIL_PORT - SMTP port (default: 587)
- EMAIL_SECURE - Use TLS (default: false)
- EMAIL_USER - SMTP authentication email
- EMAIL_PASSWORD - SMTP authentication password/app-password
- EMAIL_ENABLED - Enable/disable email service (default: true)
- MONTHLY_REPORT_ENABLED - Enable/disable monthly reports (default: true)

## Testing

- ✅ Email service initialization tested
- ✅ SMTP connection verification working
- ✅ Welcome email sent successfully on user registration
- ✅ Monthly report email sent and rendered correctly
- ✅ Cron jobs scheduled correctly
- ✅ Manual job triggers working via API
- ✅ Email templates rendering properly with data
- ✅ Insights generation verified
- ✅ Graceful shutdown handles job cleanup

### 🖥️ Week 7 Summary - Frontend Development Part 1

## Completed Tasks

### ✅ Next.js Setup
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS with custom theme
- Environment variables setup
- Project structure organization

### ✅ State Management
- Zustand stores (auth, transactions)
- Persistent auth state
- Token management

### ✅ API Integration
- Axios client with interceptors
- Auto token attachment
- Error handling
- API service layer for all endpoints

### ✅ Utility Functions
- Currency formatting
- Date formatting
- Email validation
- Password validation
- Number formatting

### ✅ Authentication Pages
- Beautiful auth layout
- Login page with validation
- Register page with validation
- Form error handling
- Loading states
- API error display

### ✅ Routing & Protection
- Home/landing page
- Protected routes middleware
- Cookie-based authentication
- Auto-redirect logic

## Features Implemented
1. ✅ Next.js 14 setup with TypeScript
2. ✅ Tailwind CSS with custom theme
3. ✅ State management with Zustand
4. ✅ Complete API client
5. ✅ Auth service layer
6. ✅ Login page
7. ✅ Registration page
8. ✅ Form validation
9. ✅ Protected routes
10. ✅ Landing page

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Axios
- **Forms:** React Hook Form (ready)
- **Validation:** Zod (ready)
- **Charts:** Recharts (ready)

## File Structure
frontend/
├── app/
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── categories.ts
│   │   ├── analytics.ts
│   │   ├── subscriptions.ts
│   │   └── client.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── transactionStore.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
├── types/
│   └── index.ts
└── middleware.ts

## Testing Completed
- ✅ Backend API connection
- ✅ User registration flow
- ✅ User login flow
- ✅ Token storage
- ✅ Form validation
- ✅ Error handling
- ✅ Protected routes
- ✅ Auto-redirect

## Week 7 Final Checklist

✅ Next.js project initialized
✅ All dependencies installed
✅ Environment variables configured
✅ Tailwind CSS configured
✅ Project structure created
✅ API client implemented
✅ Auth store created
✅ Transaction store created
✅ All API services implemented
✅ Utility functions created
✅ Auth layout created
✅ Login page completed
✅ Register page completed
✅ Home page created
✅ Protected routes middleware
✅ Frontend tested with backend
✅ Auth flow verified
✅ Code committed to GitHub
✅ Week 7 documentation complete

## Next Week (Week 8)
- Dashboard layout with sidebar
- Transaction list component
- Analytics charts
- Subscription cards
- CSV upload interface
- Transaction creation form
- Complete dashboard functionality
- Final polish and deployment

---

## 👤 Author

**Ridoy Baidya**
Personal Finance Management System — SpendGuard

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.