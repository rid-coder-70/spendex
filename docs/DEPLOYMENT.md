# SpendGuard — Full Deployment Guide

> **Stack:** Next.js 16 (Frontend) · Node.js + Express + TypeScript (Backend) · PostgreSQL 17 (Database)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Local Development Setup](#2-local-development-setup)
3. [Docker Deployment (Recommended)](#3-docker-deployment-recommended)
4. [Backend Deployment — Railway](#4-backend-deployment--railway)
5. [Backend Deployment — Render](#5-backend-deployment--render)
6. [Frontend Deployment — Vercel](#6-frontend-deployment--vercel)
7. [Database Setup & Migrations](#7-database-setup--migrations)
8. [Environment Variables Reference](#8-environment-variables-reference)
9. [Post-Deployment Checklist](#9-post-deployment-checklist)
10. [CI/CD with GitHub Actions](#10-cicd-with-github-actions)
11. [Monitoring & Health Checks](#11-monitoring--health-checks)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│           Next.js 16 · Vercel · Port 3000               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST API
┌────────────────────────▼────────────────────────────────┐
│                       BACKEND                           │
│        Node.js + Express · Railway/Render · Port 5000   │
│                                                         │
│  Routes: /api/auth, /api/transactions, /api/analytics   │
│          /api/subscriptions, /api/upload, /api/reports  │
│          /api/webhooks, /api/public, /api/health        │
└────────────────────────┬────────────────────────────────┘
                         │ pg / DATABASE_URL
┌────────────────────────▼────────────────────────────────┐
│                      DATABASE                           │
│            PostgreSQL 17 · Railway / Supabase           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Local Development Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 17 | [postgresql.org](https://www.postgresql.org) |
| Git | Any | [git-scm.com](https://git-scm.com) |

### Step-by-Step

**1. Clone the repository**
```bash
git clone https://github.com/rid-coder-70/spendex.git
cd spendex
```

**2. Set up the database**
```bash
# Create the database (adjust port if needed)
psql -U postgres -p 5433 -c "CREATE DATABASE spendguard;"

# Run the schema
psql -U postgres -p 5433 -d spendguard -f database/schema.sql
```

**3. Configure backend environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your actual values (DB password, JWT secret, etc.)
```

**4. Install and run backend**
```bash
npm install
npm run dev
# → Running at http://localhost:5000
```

**5. Configure frontend environment**
```bash
cd ../frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**6. Install and run frontend**
```bash
npm install
npm run dev
# → Running at http://localhost:3000
```

---

## 3. Docker Deployment (Recommended)

The repo includes a production-ready `docker-compose.yml` at the root that starts **PostgreSQL + Backend** together with a single command.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Run with Docker Compose

```bash
# From the repo root
docker-compose up --build
```

This will:
1. Pull `postgres:17-alpine`
2. Auto-run `database/schema.sql` to initialize the schema
3. Build the backend image from `backend/Dockerfile`
4. Start the backend on **port 5000**
5. Start PostgreSQL on **port 5433** (maps to container's 5432)

### Useful Docker Commands

```bash
# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f db

# Stop everything
docker-compose down

# Stop and delete database volume (full reset)
docker-compose down -v

# Rebuild only the backend
docker-compose up --build backend
```

### Reset the Database

```bash
# From the repo root — wipes all data and re-applies schema
docker-compose down -v && docker-compose up --build
```

Or connect and run the reset script:
```bash
cd backend
npx ts-node src/scripts/resetDb.ts
```

---

## 4. Backend Deployment — Railway

Railway is the recommended platform for the backend. It supports PostgreSQL natively and auto-deploys from GitHub.

### Step 1: Create a Railway Account
- Go to [railway.app](https://railway.app) → Sign in with GitHub

### Step 2: New Project from GitHub
- Click **New Project** → **Deploy from GitHub repo**
- Select `rid-coder-70/spendex`
- Set **Root Directory** to `backend`

### Step 3: Add PostgreSQL
- In your project → **New** → **Database** → **PostgreSQL**
- Railway auto-injects `DATABASE_URL` into your backend service

### Step 4: Initialize the Database Schema
After the database is created:
```bash
# Get the connection string from Railway dashboard → PostgreSQL → Connect
psql "postgresql://postgres:...@...railway.app:PORT/railway" -f database/schema.sql
```

### Step 5: Set Environment Variables
In Railway → your backend service → **Variables**, add:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate a strong 64-char random string>
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_ENABLED=true
MONTHLY_REPORT_ENABLED=true
WEBHOOK_SECRET=<generate a strong random string>
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel
```

> `DATABASE_URL` is injected automatically by Railway — do **not** add it manually.

### Step 6: Configure Build & Start

Railway should auto-detect from `package.json`, but verify:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Step 7: Get Your Backend URL
After deploy succeeds: `https://spendguard-backend.railway.app`

Test it:
```bash
curl https://spendguard-backend.railway.app/api/health
```

---

## 5. Backend Deployment — Render

Render is a free-tier alternative to Railway.

### Step 1: Create PostgreSQL on Render
- Dashboard → **New** → **PostgreSQL**
- Name it `spendguard-db`
- Copy the **Internal Database URL**

### Step 2: Run the Schema
```bash
psql "postgresql://..." -f database/schema.sql
```

### Step 3: Create a Web Service
- Dashboard → **New** → **Web Service**
- Connect `rid-coder-70/spendex`
- Configure:

| Setting | Value |
|---------|-------|
| Name | `spendguard-api` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

### Step 4: Environment Variables
Same as Railway above. Use your **Internal Database URL** for `DATABASE_URL`.

> ⚠️ Render free-tier spins down after 15 minutes of inactivity. Upgrade to a paid plan for production use.

---

## 6. Frontend Deployment — Vercel

Vercel is purpose-built for Next.js and is the best option for the frontend.

### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `rid-coder-70/spendex` from GitHub
3. Set **Root Directory** to `frontend`
4. Add environment variables (see below)
5. Click **Deploy**

### Option B: Vercel CLI

```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

### Frontend Environment Variables

In Vercel → Project Settings → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://spendguard-backend.railway.app/api
```

> ⚠️ Make sure to update your **backend's** `FRONTEND_URL` env var to your Vercel URL to allow CORS.

---

## 7. Database Setup & Migrations

### Initial Schema

The full schema is in `database/schema.sql`. It creates all tables with indexes, foreign keys, and default triggers.

```bash
# Run locally
psql -U postgres -d spendguard -f database/schema.sql

# Run on remote
psql "postgresql://user:pass@host:port/dbname" -f database/schema.sql
```

### Tables Created

| Table | Description |
|-------|-------------|
| `users` | User accounts + hashed passwords |
| `categories` | System + user-defined transaction categories |
| `transactions` | All income/expense records |
| `subscriptions` | Auto-detected recurring charges |
| `upload_history` | CSV import records |
| `monthly_reports` | Generated report cache |

### Seed Test Data (Development only)

```bash
cd backend
npm run seed:test
# Creates: test@example.com / Test123! with 10 sample transactions
```

### Reset Database

```bash
cd backend
npx ts-node src/scripts/resetDb.ts
# Truncates ALL tables with CASCADE — use with caution!
```

---

## 8. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ | Runtime environment | `production` |
| `PORT` | ✅ | Server port | `5000` |
| `DATABASE_URL` | ✅* | Full PostgreSQL connection string | `postgresql://...` |
| `DB_HOST` | ✅* | DB host (if not using DATABASE_URL) | `localhost` |
| `DB_PORT` | ✅* | DB port | `5432` |
| `DB_NAME` | ✅* | Database name | `spendguard` |
| `DB_USER` | ✅* | Database user | `postgres` |
| `DB_PASSWORD` | ✅* | Database password | `secret` |
| `JWT_SECRET` | ✅ | Secret key for JWT signing | 64-char random string |
| `JWT_EXPIRE` | ✅ | Token expiry | `7d` |
| `EMAIL_HOST` | ⚠️ | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | ⚠️ | SMTP port | `587` |
| `EMAIL_SECURE` | ⚠️ | Use TLS | `false` |
| `EMAIL_USER` | ⚠️ | SMTP username | `you@gmail.com` |
| `EMAIL_PASSWORD` | ⚠️ | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_ENABLED` | ⚠️ | Enable email sending | `true` / `false` |
| `MONTHLY_REPORT_ENABLED` | ⚠️ | Enable monthly cron | `true` |
| `FRONTEND_URL` | ✅ | Allowed CORS origin | `https://your-app.vercel.app` |
| `WEBHOOK_SECRET` | ⚠️ | Secret for webhook verification | Random string |
| `MAX_FILE_SIZE` | ✅ | Max CSV upload size in bytes | `5242880` (5MB) |
| `ALLOWED_FILE_TYPES` | ✅ | Allowed MIME types | `text/csv,...` |

> ✅ = Required · ⚠️ = Required for that feature · *Either `DATABASE_URL` or individual `DB_*` fields

### Frontend (`frontend/.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL | `http://localhost:5000/api` |

---

## 9. Post-Deployment Checklist

### Backend
- [ ] `/api/health` returns `200 OK`
- [ ] `/api/health/db` returns `200 OK` with DB timestamp
- [ ] `POST /api/auth/register` creates a user
- [ ] `POST /api/auth/login` returns a valid JWT
- [ ] CORS is allowing your frontend URL
- [ ] Rate limiting is active (100 req/15min per IP)

### Frontend
- [ ] App loads without errors
- [ ] Login and Register pages work
- [ ] Dashboard loads after login
- [ ] Weather widget shows correctly
- [ ] Transactions can be added

### Email (if enabled)
- [ ] Gmail App Password is set (not your real Gmail password)
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] Test: `POST /api/reports/send`

### Security
- [ ] `JWT_SECRET` is a strong random string (not a dictionary word)
- [ ] `WEBHOOK_SECRET` is set and not the placeholder value
- [ ] Real `.env` is **not** committed to Git
- [ ] `NODE_ENV=production` in production

---

## 10. CI/CD with GitHub Actions

The repo includes `.github/workflows/ci.yml` that runs on every push to `main`.

### What it does
1. Spins up PostgreSQL 17 test database
2. Installs backend dependencies
3. Runs `npm run build` (TypeScript compile check)

### Viewing Results
- Go to `https://github.com/rid-coder-70/spendex/actions`
- A **green checkmark** = build passes
- A **red X** = TypeScript errors found

### CI Badge
The badge at the top of `README.md` shows live status:
```
[![CI](https://github.com/rid-coder-70/spendex/actions/workflows/ci.yml/badge.svg)](...)
```

---

## 11. Monitoring & Health Checks

### Health Endpoints

```bash
# Server health
GET /api/health
→ { "success": true, "message": "SpendGuard API is running", "timestamp": "..." }

# Database connectivity
GET /api/health/db
→ { "success": true, "data": { "timestamp": "...", "version": "PostgreSQL 17..." } }

# Public platform stats
GET /api/public/stats
→ { "success": true, "data": { "total_users": 12, "total_transactions": 543 } }
```

### Recommended Monitoring Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| [UptimeRobot](https://uptimerobot.com) | Ping `/api/health` every 5 min | ✅ |
| [Railway Metrics](https://railway.app) | CPU/Memory graphs | ✅ |
| [Vercel Analytics](https://vercel.com/analytics) | Frontend performance | ✅ |
| [Sentry](https://sentry.io) | Error tracking | ✅ (5k errors/mo) |

### Set Up UptimeRobot (Free)
1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up
2. **Add New Monitor** → HTTP(s)
3. URL: `https://your-backend.railway.app/api/health`
4. Check interval: 5 minutes
5. Alert contact: your email

---

## 12. Troubleshooting

### `CORS Error` — Frontend blocked by backend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Update `FRONTEND_URL` in your backend environment variables to exactly match your frontend URL (including `https://` and no trailing slash).

---

### `Database connection failed` on startup
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix:**
- Check `DATABASE_URL` or `DB_*` variables are correct
- Ensure the database server is running
- Verify the database `spendguard` exists
- For Docker: ensure the `db` service is healthy before `backend` starts (already configured with `depends_on` + healthcheck)

---

### `401 Unauthorized` on all API calls
**Fix:**
- Check `JWT_SECRET` is the same between deploys (changing it invalidates all tokens)
- Make sure the frontend is sending `Authorization: Bearer <token>` header

---

### `Email not sending`
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Fix:**
1. Enable 2-Factor Authentication on your Google account
2. Go to `myaccount.google.com/apppasswords`
3. Generate an **App Password** for "Mail"
4. Use that 16-character code as `EMAIL_PASSWORD` — **not** your Gmail password

---

### `TypeScript build fails` in CI
```
error TS2307: Cannot find module '...'
```
**Fix:** Run `npm run build` locally first to identify the error. The CI workflow mirrors this exact step.

---

### CSV Upload fails
```
MulterError: File too large
```
**Fix:** Ensure `MAX_FILE_SIZE` is set correctly (`5242880` = 5MB). Reduce your CSV file size or increase the limit.

---

### Rate limiting triggers unexpectedly (`429 Too Many Requests`)
The backend limits each IP to **100 requests per 15 minutes**.

**Fix for development:** This is normal if you're refreshing rapidly. Wait 15 minutes or adjust `windowMs` / `max` in `backend/src/app.ts` for your dev environment.
