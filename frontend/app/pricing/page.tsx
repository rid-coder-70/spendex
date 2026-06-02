import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '৳0',
    period: 'forever',
    desc: 'Perfect for individuals getting started with personal finance tracking.',
    highlight: false,
    cta: 'Get started free',
    href: '/auth/register',
    features: [
      'Up to 100 transactions/month',
      'All 6 analytics charts',
      'CSV import (single file)',
      'Subscription detection',
      'Email reports (monthly)',
      'Mobile-optimized dashboard',
    ],
    missing: [
      'Unlimited transactions',
      'Priority support',
      'Webhook integrations',
      'API access',
    ],
  },
  {
    name: 'Pro',
    price: '৳499',
    period: '/month',
    desc: 'For power users who want unlimited tracking and automation.',
    highlight: true,
    cta: 'Start Pro free for 14 days',
    href: '/auth/register',
    badge: 'Most Popular',
    features: [
      'Unlimited transactions',
      'All analytics & trends',
      'Unlimited CSV imports',
      'Subscription auto-detection',
      'Weekly + monthly email reports',
      'Webhook integration',
      'REST API access',
      'Priority email support',
      'Export to PDF/CSV',
    ],
    missing: [],
  },
  {
    name: 'Team',
    price: '৳1,499',
    period: '/month',
    desc: 'For small teams or families managing shared finances together.',
    highlight: false,
    cta: 'Contact us',
    href: 'mailto:ridoybaidya2@gmail.com',
    features: [
      'Everything in Pro',
      'Up to 5 members',
      'Shared dashboards',
      'Role-based access',
      'Consolidated reports',
      'Dedicated support',
    ],
    missing: [],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 pb-16 border-b border-zinc-100 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              No hidden fees. Cancel anytime.
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              Simple, honest<br />
              <span className="text-blue-600">pricing</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed">
              Start free forever. Upgrade when you need more power.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-6 flex flex-col transition-all ${
                    plan.highlight
                      ? 'border-zinc-900 shadow-lg relative'
                      : 'border-zinc-100 shadow-sm hover:border-zinc-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 text-white text-[10px] font-semibold rounded-full">
                        <Zap className="w-2.5 h-2.5" /> {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-zinc-900">{plan.price}</span>
                      <span className="text-sm text-zinc-400">{plan.period}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{plan.desc}</p>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full text-center py-2.5 text-sm font-medium rounded-lg transition-colors mb-6 ${
                      plan.highlight
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-2 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.missing.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-300 line-through">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-200 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-zinc-900 mb-8 text-center">Pricing FAQ</h2>
            <div className="space-y-4">
              {[
                { q: 'Is the Free plan really free forever?', a: 'Yes. The Free plan has no time limit. You can use SpendGuard indefinitely without a credit card or paying anything.' },
                { q: 'What happens if I exceed the Free plan limits?', a: 'You\'ll be notified when you approach the limit. Your existing data is never deleted — you just won\'t be able to add more until you upgrade.' },
                { q: 'Can I cancel my Pro plan at any time?', a: 'Absolutely. No contracts, no cancellation fees. Cancel anytime from your account settings and your data remains accessible.' },
                { q: 'Do you offer student or NGO discounts?', a: 'Yes! Email us at ridoybaidya2@gmail.com with proof of student status or organization details for a custom quote.' },
              ].map(({ q, a }) => (
                <div key={q} className="card p-5">
                  <p className="text-sm font-semibold text-zinc-900 mb-1.5">{q}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 border-t border-zinc-100">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">Start free, upgrade when ready</h2>
            <p className="text-sm text-zinc-500 mb-6">No commitment. Full features. All on you.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
              Create free account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
