# 🖥️ SpendGuard — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

The **Next.js 16** frontend for SpendGuard — a personal finance dashboard with analytics charts, transaction management, and CSV import capabilities.

---

## 📋 Prerequisites

- **Node.js** v18+
- **npm** v9+
- SpendGuard backend running on `http://localhost:5000`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.local` file is already set up to point to the local backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
If your backend runs on a different port, update this value.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (metadata, font, global providers)
│   │   ├── page.tsx           # Home / landing page
│   │   └── globals.css        # Global styles & design tokens
│   ├── components/            # Reusable UI components (in progress)
│   ├── contexts/              # React context providers (in progress)
│   │   └── AuthContext.tsx    # JWT auth state (in progress)
│   ├── hooks/                 # Custom React hooks (in progress)
│   ├── lib/                   # Shared utilities (in progress)
│   │   ├── api.ts             # Axios instance with JWT interceptors
│   │   └── utils.ts           # Helper functions
│   ├── styles/                # Additional stylesheets
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── .env.local                 # Environment variables (not committed)
├── next.config.ts             # Next.js configuration
├── tailwind.config            # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.4 | React framework + App Router + SSR |
| `react` | 19.2.4 | UI component library |
| `typescript` | 5.x | Static type checking |
| `tailwindcss` | 4.x | Utility-first CSS framework |
| `axios` | 1.x | HTTP client with JWT interceptors |
| `recharts` | 3.x | Charts — area, bar, pie, line |
| `react-hook-form` | 7.x | Performant form state management |
| `zod` | 4.x | Runtime schema validation |
| `zustand` | 5.x | Lightweight global state |
| `lucide-react` | 1.x | Clean SVG icon library |
| `date-fns` | 4.x | Date parsing & formatting |
| `clsx` | 2.x | Conditional className utility |

---

## 🧩 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build optimised production bundle |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 🔗 API Connection

All API calls go through the `NEXT_PUBLIC_API_URL` environment variable. The Axios instance (in `src/lib/api.ts`) automatically attaches the JWT from local storage to every protected request.

Backend health checks:
- `GET /api/health` — server status
- `GET /api/health/db` — database connectivity

---

## 🗺️ Planned Pages

| Route | Page | Status |
|---|---|---|
| `/` | Home / Landing | ✅ Scaffold |
| `/login` | Login | 🔄 In Progress |
| `/register` | Register | 🔄 In Progress |
| `/dashboard` | Overview + Charts | 🔄 In Progress |
| `/transactions` | CRUD + CSV Import | 🔄 In Progress |
| `/categories` | Category Management | 🔄 In Progress |
| `/subscriptions` | Subscription Detection | 🔄 In Progress |
| `/analytics` | Spending Trends | 🔄 In Progress |
| `/reports` | Monthly Reports + Email | 🔄 In Progress |

---

## 🔙 Related

- [Backend README](../backend/README.md)
- [Main Project README](../README.md)
- [Database Schema](../database/schema.sql)
