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
| `PUT` | `/api/subscriptions/:id` | Update subscription |
| `POST` | `/api/subscriptions/detect` | Trigger auto-detection |

### 📊 Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Monthly income/expense totals |
| `GET` | `/api/analytics/category-breakdown` | Spend per category |
| `GET` | `/api/analytics/spending-trends` | Multi-month trend data |

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

### In Progress
| Task | Status |
|---|---|
| JWT authentication middleware | 🔄 In Progress |
| Auth routes (register, login, me) | 🔄 In Progress |
| Transaction CRUD routes | 🔄 In Progress |
| Category management routes | 🔄 In Progress |
| Subscription detection routes | 🔄 In Progress |
| Analytics endpoints | 🔄 In Progress |
| CSV upload + auto-categorisation | 🔄 In Progress |
| Frontend components (Sidebar, AppShell) | 🔄 In Progress |
| Auth pages (Login + Register) | 🔄 In Progress |
| Dashboard with charts | 🔄 In Progress |

### Upcoming
- [ ] Nodemailer email integration (monthly reports)
- [ ] Node-Cron background jobs (subscription detection, report generation)
- [ ] Budget limits & alerts
- [ ] Unit & integration tests
- [ ] Docker Compose setup
- [ ] Vercel + Railway deployment

---

## 👤 Author

**Ridoy Baidya**
Personal Finance Management System — SpendGuard

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.