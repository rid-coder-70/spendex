'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { publicAPI, PublicStats } from '@/lib/api/public';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  PieChart,
  Smartphone,
  RefreshCcw,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicAPI.getStats();
        if (res.success && res.data) setStats(res.data);
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">

        <section className="pt-28 pb-20 px-6 border-b border-zinc-100">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Free to start — no credit card required
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-[1.15] mb-5">
              Personal finance,<br />
              <span className="text-blue-600">simplified.</span>
            </h1>

            <p className="text-base text-zinc-500 max-w-xl mx-auto mb-8 leading-relaxed">
              SpendGuard helps you track every transaction, spot patterns, and make
              smarter decisions — without the complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="btn-primary px-5 py-2.5"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-secondary px-5 py-2.5"
              >
                <span>See how it works</span>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {stats?.totalUsers?.toLocaleString() || '50,000'}+ users
              </span>
              <span className="w-px h-3 bg-zinc-200" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ${((stats?.monthlyVolume || 2_000_000) / 1_000_000).toFixed(1)}M+ tracked monthly
              </span>
              <span className="w-px h-3 bg-zinc-200" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Rated {stats?.rating || '4.9'}/5
              </span>
            </div>
          </div>
        </section>
        <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            {/* Minimal browser frame mockup */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="ml-3 flex-1 bg-white border border-zinc-200 rounded text-xs text-zinc-400 px-2 py-0.5 max-w-[200px]">
                  app.spendguard.io/dashboard
                </div>
              </div>

              <div className="flex h-72">
                <div className="w-36 border-r border-zinc-100 p-3 space-y-1 hidden sm:block">
                  {['Dashboard', 'Transactions', 'Analytics', 'Subscriptions', 'Upload CSV'].map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${i === 0 ? 'bg-zinc-900' : ''}`}
                    >
                      <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-white/30' : 'bg-zinc-200'}`} />
                      <div className={`h-2 rounded ${i === 0 ? 'bg-white/60 w-14' : 'bg-zinc-100 w-12'}`} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Income', val: '৳45,000', color: 'bg-emerald-50' },
                      { label: 'Expenses', val: '৳28,500', color: 'bg-red-50' },
                      { label: 'Savings', val: '৳16,500', color: 'bg-blue-50' },
                      { label: 'Subs', val: '7', color: 'bg-violet-50' },
                    ].map(card => (
                      <div key={card.label} className={`${card.color} rounded-lg p-2`}>
                        <div className="h-1.5 w-6 bg-white/60 rounded mb-1.5" />
                        <div className="h-2.5 w-10 bg-zinc-400/30 rounded mb-1" />
                        <div className="h-1.5 w-8 bg-zinc-300/30 rounded" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-zinc-100 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <div className="h-2 w-28 bg-zinc-200 rounded" />
                    </div>
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-zinc-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-zinc-100" />
                          <div className="space-y-1">
                            <div className="h-1.5 w-20 bg-zinc-200 rounded" />
                            <div className="h-1.5 w-12 bg-zinc-100 rounded" />
                          </div>
                        </div>
                        <div className={`h-2 w-10 rounded ${i % 2 === 0 ? 'bg-emerald-200' : 'bg-red-200'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 px-6 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Features</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Everything you need</h2>
              <p className="text-sm text-zinc-500 mt-1.5">Built for people who want clarity without complexity.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Smart Categorization', desc: 'Transactions are auto-categorized so you always know where your money goes.', icon: Zap },
                { title: 'Spending Insights',    desc: 'Visual breakdowns and trends show your financial habits at a glance.',        icon: PieChart },
                { title: 'Security First',       desc: 'End-to-end encryption keeps your financial data private and secure.',         icon: ShieldCheck },
                { title: 'Subscription Tracker', desc: 'Never miss a recurring charge. See all your subscriptions in one place.',     icon: RefreshCcw },
                { title: 'Mobile Ready',         desc: 'Fully responsive — works perfectly on any screen size.',                      icon: Smartphone },
                { title: 'Trend Analysis',       desc: 'Track your net worth over time and forecast future spending.',                 icon: TrendingUp },
              ].map(({ title, desc, icon: Icon }) => (
                <div key={title} className="feature-card">
                  <div className="feature-icon">
                    <Icon className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">How it works</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Up and running in minutes</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Create account', desc: 'Sign up for free in under 60 seconds.' },
                { step: '02', title: 'Add data',        desc: 'Enter transactions manually or upload a CSV.' },
                { step: '03', title: 'Get insights',    desc: 'See categorized spending and trends instantly.' },
                { step: '04', title: 'Take control',    desc: 'Make better decisions with clear financial data.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="step-card">
                  <span className="step-number">{step}</span>
                  <h3 className="step-title">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 px-6 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Testimonials</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Loved by our users</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  quote: "The first finance app that doesn't feel like a chore. It's a joy to use daily.",
                  author: 'Sarah Jenkins',
                  role: 'Product Designer',
                  initials: 'SJ',
                  stars: 5,
                },
                {
                  quote: 'The predictive analytics saved me from three bad decisions in my first month.',
                  author: 'Michael Chen',
                  role: 'Founder @ TechFlow',
                  initials: 'MC',
                  stars: 5,
                },
                {
                  quote: 'Unmatched speed and simplicity. This is the standard for how fintech should feel.',
                  author: 'Emma Rodriguez',
                  role: 'Venture Partner',
                  initials: 'ER',
                  stars: 5,
                },
              ].map(t => (
                <div key={t.author} className="testimonial-card">
                  {/* Star rating */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed mb-4 relative z-10">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-2.5 border-t border-zinc-100 pt-4">
                    <div className="testimonial-avatar">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{t.author}</p>
                      <p className="text-[11px] text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">
              Start tracking for free
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              No contracts. No hidden fees. Just total financial clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="btn-primary px-5 py-2.5"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="btn-secondary px-5 py-2.5"
              >
                <span>Book a demo</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}