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
│   ├── controllers/           # Route handler business logic (in progress)
│   ├── middleware/            # Custom middleware
│   │   └── (auth.ts)          # JWT auth guard (in progress)
│   ├── models/                # Data access layer / query builders (in progress)
│   ├── routes/                # Express Router definitions (in progress)
│   ├── services/              # Business logic services (in progress)
│   ├── jobs/                  # Node-Cron scheduled tasks (in progress)
│   ├── utils/                 # Shared helper utilities
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

### 🔜 Next (Week 4)
- CSV file upload & parsing logic
- Bulk transaction import
- Auto-categorization enhancement
- Error handling for invalid CSV
- Upload history tracking

---

## 🧩 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start nodemon hot-reload server |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed:test` | Seed categories + test user + 10 sample transactions |
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
