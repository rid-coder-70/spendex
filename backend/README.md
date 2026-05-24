# ⚙️ SpendGuard — Backend API

[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql)](https://postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)

The engine behind SpendGuard. A robust RESTful API built with Node.js, Express, and PostgreSQL, focusing on performance, security, and financial accuracy.

---

## 🛠️ Features
- **RESTful API**: Clean endpoints for financial management.
- **JWT Security**: Secure user authentication and authorization.
- **PostgreSQL Integration**: Optimized database schema with indexing and triggers.
- **Automated Tasks**: Cron jobs for weekly/monthly financial reports.
- **Email Service**: Integration with Nodemailer for automated notifications.
- **Auto-Categorization**: Intelligent merchant matching for transaction classification.

---

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5433/spendguard
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Initialize Database
Ensure PostgreSQL is running on **port 5433** and execute:
```bash
# Using psql
psql -h localhost -p 5433 -U postgres -d spendguard -f ../database/schema.sql
```

### 4. Seed Data (Optional)
```bash
npm run seed:test-data
npm run seed:subscriptions
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🧩 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with `nodemon` for hot-reloading. |
| `npm run build` | Compiles TypeScript to production-ready JS in `dist/`. |
| `npm start` | Runs the compiled production build. |
| `npm run seed:test-data` | Generates a test user and sample transactions. |

---

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/       # Database & Environment config
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth & Validation
│   ├── models/       # Database queries (Model layer)
│   ├── routes/       # API endpoint definitions
│   ├── services/     # Business logic (Email, Reports)
│   ├── types/        # TypeScript interfaces
│   └── app.ts        # Express app initialization
└── dist/             # Compiled production code
```

---

## 🔗 Related Links
- [🖥️ Frontend README](../frontend/README.md)
- [🌌 Main README](../README.md)
- [🚀 Deployment Guide](../docs/DEPLOYMENT.md)
