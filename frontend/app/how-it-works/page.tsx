import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserPlus, UploadCloud, BarChart3, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create your free account',
    desc: 'Sign up in under 60 seconds with just your name and email. No credit card. No subscription. No catch.',
    details: [
      'Email & password registration',
      'Secure JWT session — stays logged in',
      'Your data is private and encrypted',
    ],
    color: 'bg-blue-50 text-blue-600',
  },
  {
    step: '02',
    icon: UploadCloud,
    title: 'Add your transactions',
    desc: 'Add transactions one at a time, or bulk-import an entire year of bank history with a single CSV upload.',
    details: [
      'Manual entry with merchant, date & payment method',
      'CSV bulk import — up to 5MB in one upload',
      'Auto-categorization into 19 default categories',
    ],
    color: 'bg-violet-50 text-violet-600',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Get instant insights',
    desc: 'The moment your data is in, SpendGuard analyses your spending patterns and displays clear, actionable charts.',
    details: [
      'Monthly income vs. expense summary',
      'Category-level spending breakdown',
      'Top merchants & trends over time',
    ],
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    step: '04',
    icon: ShieldCheck,
    title: 'Make better financial decisions',
    desc: 'With full visibility into your finances, you\'ll naturally reduce wasteful spending, track subscriptions, and grow savings.',
    details: [
      'Subscription auto-detection',
      'Monthly email reports in your inbox',
      'Webhook integration for real-time data',
    ],
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 pb-16 border-b border-zinc-100 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Up and running in under 2 minutes
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              How SpendGuard<br />
              <span className="text-blue-600">works for you</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed">
              From sign-up to full financial clarity — in four simple steps.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map(({ step, icon: Icon, title, desc, details, color }, index) => (
              <div key={step} className="card p-8 hover:border-zinc-300 transition-all">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color.split(' ')[0]}`}>
                      <Icon className={`w-7 h-7 ${color.split(' ')[1]}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-semibold text-zinc-400 tracking-wider">STEP {step}</span>
                      {index === 0 && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full">FREE</span>}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4">{desc}</p>
                    <ul className="space-y-1.5">
                      {details.map(d => (
                        <li key={d} className="flex items-center gap-2 text-xs text-zinc-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-zinc-900 mb-8 text-center">Common questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Is my banking data safe?', a: 'Yes. SpendGuard never connects to your bank directly. You enter or upload data yourself. All passwords are hashed with bcrypt and connections are encrypted.' },
                { q: 'Can I import from any bank?', a: 'Yes. If your bank lets you export a CSV of transactions, you can import it directly. Use the template from the Upload page as a guide.' },
                { q: 'What currencies are supported?', a: 'SpendGuard is currency-agnostic — it stores amounts as numbers and you choose how to display them. It\'s optimized for BDT but works for any currency.' },
                { q: 'How does subscription detection work?', a: 'SpendGuard scans your transaction history for recurring charges with similar amounts and merchants, then flags them as subscriptions automatically.' },
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
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">Start in 60 seconds</h2>
            <p className="text-sm text-zinc-500 mb-6">No credit card. No setup fee. Just financial clarity.</p>
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
