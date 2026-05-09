# 🖥️ SpendGuard — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

The frontend application for SpendGuard, a personal finance management system. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **Validation:** Zod
- **Charts:** Recharts

---

## 📁 File Structure
```
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
```

---

## 📈 Week 7 Summary - Frontend Development Part 1

### ✅ Completed Tasks

#### Next.js Setup
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS with custom theme
- Environment variables setup
- Project structure organization

#### State Management
- Zustand stores (auth, transactions)
- Persistent auth state
- Token management

#### API Integration
- Axios client with interceptors
- Auto token attachment
- Error handling
- API service layer for all endpoints

#### Utility Functions
- Currency formatting
- Date formatting
- Email validation
- Password validation
- Number formatting

#### Authentication Pages
- Beautiful auth layout
- Login page with validation
- Register page with validation
- Form error handling
- Loading states
- API error display

#### Routing & Protection
- Home/landing page
- Protected routes middleware
- Cookie-based authentication
- Auto-redirect logic

### ✅ Features Implemented
1. Next.js 14 setup with TypeScript
2. Tailwind CSS with custom theme
3. State management with Zustand
4. Complete API client
5. Auth service layer
6. Login page
7. Registration page
8. Form validation
9. Protected routes
10. Landing page

### ✅ Testing Completed
- Backend API connection
- User registration flow
- User login flow
- Token storage
- Form validation
- Error handling
- Protected routes
- Auto-redirect

## Next Week (Week 8)
- Dashboard layout with sidebar
- Transaction list component
- Analytics charts
- Subscription cards
- CSV upload interface
- Transaction creation form
- Complete dashboard functionality
- Final polish and deployment
