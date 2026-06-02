import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Zap, PieChart, ShieldCheck, RefreshCcw, Smartphone, TrendingUp,
  UploadCloud, Bell, BarChart3, ArrowRight, CheckCircle2, Globe, Lock
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Smart Auto-Categorization',
    desc: 'Transactions are instantly categorized using intelligent pattern recognition — groceries, transport, subscriptions, and more. No manual tagging needed.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: PieChart,
    title: 'Visual Spending Insights',
    desc: 'Beautiful, interactive charts break down your finances by category, merchant, and time period. Understand where every taka is going at a glance.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    desc: 'Your data is protected with bcrypt password hashing, JWT token authentication, and encrypted connections. We never store raw payment details.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: RefreshCcw,
    title: 'Subscription Intelligence',
    desc: 'SpendGuard automatically detects recurring charges and groups them as subscriptions — so you can cancel what you no longer use.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: UploadCloud,
    title: 'CSV Bulk Import',
    desc: 'Already have transaction history? Upload a CSV from your bank and SpendGuard will auto-import and categorize everything in seconds.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: Bell,
    title: 'Automated Email Reports',
    desc: 'Get beautifully formatted monthly financial summaries delivered to your inbox — income, expenses, savings rate, and top spending categories.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: BarChart3,
    title: 'Trend & Forecast Analysis',
    desc: 'Track your net savings over months, identify rising expenses early, and compare your current month against historical averages.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    desc: 'The SpendGuard dashboard is optimized for any screen — desktop, tablet, or mobile — so you always have your finances at your fingertips.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Globe,
    title: 'Webhook Integration',
    desc: 'Connect external payment providers via webhooks. Real-time transaction events flow directly into your SpendGuard account automatically.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Lock,
    title: 'Rate-Limited API',
    desc: 'The backend enforces rate limiting and input validation on every endpoint — protecting your account from brute force and abuse.',
    color: 'bg-zinc-100 text-zinc-600',
  },
  {
    icon: TrendingUp,
    title: 'Income vs Expense Tracking',
    desc: 'See a clear breakdown of every income source and expense category each month — salary, freelance, groceries, utilities, and more.',
    color: 'bg-green-50 text-green-600',
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
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Start free today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card p-6 hover:border-zinc-300 hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[0]}`}>
                    <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
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
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-700 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
