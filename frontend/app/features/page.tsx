import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Zap, PieChart, ShieldCheck, RefreshCcw, Smartphone, TrendingUp,
  UploadCloud, Bell, BarChart3, ArrowRight, Globe, Lock
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Smart Auto-Categorization',
    desc: 'Transactions are instantly categorized using intelligent pattern recognition — groceries, transport, subscriptions, and more. No manual tagging needed.',
    bg: 'bg-amber-50',   iconColor: 'text-amber-600',   hoverBg: 'group-hover:bg-amber-500',
  },
  {
    icon: PieChart,
    title: 'Visual Spending Insights',
    desc: 'Beautiful, interactive charts break down your finances by category, merchant, and time period. Understand where every taka is going at a glance.',
    bg: 'bg-blue-50',    iconColor: 'text-blue-600',    hoverBg: 'group-hover:bg-blue-500',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    desc: 'Your data is protected with bcrypt password hashing, JWT token authentication, and encrypted connections. We never store raw payment details.',
    bg: 'bg-emerald-50', iconColor: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-500',
  },
  {
    icon: RefreshCcw,
    title: 'Subscription Intelligence',
    desc: 'SpendGuard automatically detects recurring charges and groups them as subscriptions — so you can cancel what you no longer use.',
    bg: 'bg-violet-50',  iconColor: 'text-violet-600',  hoverBg: 'group-hover:bg-violet-500',
  },
  {
    icon: UploadCloud,
    title: 'CSV Bulk Import',
    desc: 'Already have transaction history? Upload a CSV from your bank and SpendGuard will auto-import and categorize everything in seconds.',
    bg: 'bg-cyan-50',    iconColor: 'text-cyan-600',    hoverBg: 'group-hover:bg-cyan-500',
  },
  {
    icon: Bell,
    title: 'Automated Email Reports',
    desc: 'Get beautifully formatted monthly financial summaries delivered to your inbox — income, expenses, savings rate, and top spending categories.',
    bg: 'bg-rose-50',    iconColor: 'text-rose-600',    hoverBg: 'group-hover:bg-rose-500',
  },
  {
    icon: BarChart3,
    title: 'Trend & Forecast Analysis',
    desc: 'Track your net savings over months, identify rising expenses early, and compare your current month against historical averages.',
    bg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  hoverBg: 'group-hover:bg-indigo-500',
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    desc: 'The SpendGuard dashboard is optimized for any screen — desktop, tablet, or mobile — so you always have your finances at your fingertips.',
    bg: 'bg-orange-50',  iconColor: 'text-orange-600',  hoverBg: 'group-hover:bg-orange-500',
  },
  {
    icon: Globe,
    title: 'Webhook Integration',
    desc: 'Connect external payment providers via webhooks. Real-time transaction events flow directly into your SpendGuard account automatically.',
    bg: 'bg-teal-50',    iconColor: 'text-teal-600',    hoverBg: 'group-hover:bg-teal-500',
  },
  {
    icon: Lock,
    title: 'Rate-Limited API',
    desc: 'The backend enforces rate limiting and input validation on every endpoint — protecting your account from brute force and abuse.',
    bg: 'bg-zinc-100',   iconColor: 'text-zinc-600',    hoverBg: 'group-hover:bg-zinc-700',
  },
  {
    icon: TrendingUp,
    title: 'Income vs Expense Tracking',
    desc: 'See a clear breakdown of every income source and expense category each month — salary, freelance, groceries, utilities, and more.',
    bg: 'bg-green-50',   iconColor: 'text-green-600',   hoverBg: 'group-hover:bg-green-500',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 pb-16 border-b border-zinc-100 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Everything you need, nothing you don&apos;t
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              Powerful features.<br />
              <span className="text-blue-600">Zero complexity.</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed mb-8">
              SpendGuard is built for people who want full financial visibility without spending hours configuring software.
            </p>
            <Link href="/auth/register" className="btn-primary px-5 py-2.5">
              <span className="relative z-10 flex items-center gap-2">
                Start free today <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc, bg, iconColor, hoverBg }) => (
                <div key={title} className="feature-card group">
                  {/* Icon — scales + fills with card's own colour on hover */}
                  <div className={`feature-icon ${bg} ${hoverBg} transition-all duration-300`}>
                    <Icon className={`w-5 h-5 ${iconColor} group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">Ready to take control?</h2>
            <p className="text-sm text-zinc-500 mb-6">Join thousands of users who finally understand their money.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="btn-primary px-5 py-2.5">
                <span className="relative z-10 flex items-center gap-2">
                  Get started free <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/pricing" className="btn-secondary px-5 py-2.5">
                <span className="relative z-10">View pricing</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
