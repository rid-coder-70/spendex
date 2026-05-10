# 🖥️ SpendGuard — Frontend Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-ff0055?style=flat-square&logo=framer)](https://framer.com/motion)

The visual heart of SpendGuard. A premium, high-fidelity dashboard built with Next.js 14, focused on providing a fluid and intuitive user experience for personal finance management.

---

## ✨ Features
- **Premium UI/UX**: Modern glassmorphism design with animated backgrounds and spring-physics interactions.
- **Dynamic Charts**: Interactive financial trends and category breakdowns using Recharts.
- **Smart Transactions**: Full CRUD support with search, filtering, and pagination.
- **CSV Bulk Import**: Drag-and-drop interface for batch transaction processing.
- **Mobile First**: Fully responsive sidebar and layout optimized for all devices.
- **Notification Center**: Real-time alerts for budget milestones and subscriptions.

---

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **Animations**: Framer Motion
- **State Management**: Zustand (Persistent)
- **Data Fetching**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 📁 Project Structure
```
frontend/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/
│   ├── layout/       # Sidebar, Header, Global Layouts
│   ├── ui/           # Reusable Atomic Components (Buttons, Cards)
│   ├── analytics/    # Chart components
│   └── transactions/ # List & Modal components
├── lib/
│   ├── api/          # Axios service layer
│   ├── stores/       # Zustand state management
│   └── utils/        # Formatters & Helpers
├── types/            # Global TypeScript interfaces
└── public/           # Static assets & icons
```

---

## 🧩 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot-reloading. |
| `npm run build` | Generates an optimized production build. |
| `npm start` | Starts the built application in production mode. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

---

## 🔗 Related Links
- [⚙️ Backend README](../backend/README.md)
- [🌌 Main README](../README.md)
- [📝 WEEK 8 Summary](../docs/WEEK8_SUMMARY.md)
