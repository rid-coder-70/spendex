import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function TermsPage() {
  const lastUpdated = 'June 2, 2026';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10 pb-8 border-b border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Legal</p>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-3">Terms of Service</h1>
            <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-zinc-700">

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm leading-relaxed">
                By accessing or using SpendGuard (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">2. Description of Service</h2>
              <p className="text-sm leading-relaxed">
                SpendGuard is a personal finance management platform that allows users to track transactions, analyze spending patterns, detect subscriptions, and generate financial reports. The service is provided &quot;as is&quot; for personal use.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">3. Account Registration</h2>
              <ul className="space-y-2">
                {[
                  'You must provide accurate name and email during registration',
                  'You are responsible for maintaining the security of your password',
                  'You must be at least 13 years old to use SpendGuard',
                  'One account per person — shared accounts are not permitted on the Free plan',
                  'You must notify us immediately of any unauthorized use of your account',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">4. Acceptable Use</h2>
              <p className="text-sm leading-relaxed mb-3">You agree not to:</p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
                {[
                  'Upload malicious files or attempt to inject harmful code',
                  'Attempt to access other users\' accounts or data',
                  'Use the API to scrape, spam, or abuse the service',
                  'Reverse engineer, decompile, or resell the service',
                  'Use SpendGuard for illegal financial activity',
                  'Attempt to bypass rate limiting or authentication',
                ].map(item => (
                  <p key={item} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="shrink-0 mt-0.5">✗</span> {item}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">5. Data Ownership</h2>
              <p className="text-sm leading-relaxed">
                You retain full ownership of all financial data you enter into SpendGuard. We do not claim any rights over your personal or financial information. You may export or delete your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">6. Service Availability</h2>
              <p className="text-sm leading-relaxed">
                We aim for high availability but cannot guarantee 100% uptime. We may perform maintenance, upgrades, or experience outages without prior notice. We are not liable for losses resulting from service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">7. No Financial Advice</h2>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  SpendGuard is a data visualization and tracking tool — not a financial advisor.
                </p>
                <p className="text-sm text-amber-700 leading-relaxed mt-2">
                  Nothing in the SpendGuard platform constitutes financial, investment, tax, or legal advice. Always consult a qualified professional before making major financial decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-sm leading-relaxed">
                To the maximum extent permitted by law, SpendGuard and its creator shall not be liable for any indirect, incidental, special, or consequential damages — including loss of profits, data, or goodwill — arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">9. Termination</h2>
              <p className="text-sm leading-relaxed">
                You may delete your account at any time from the account settings page. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, your data will be permanently deleted within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">10. Changes to Terms</h2>
              <p className="text-sm leading-relaxed">
                We may update these Terms of Service from time to time. Significant changes will be communicated by email. Continued use of SpendGuard after changes are posted constitutes your acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">11. Governing Law</h2>
              <p className="text-sm leading-relaxed">
                These Terms are governed by the laws of Bangladesh. Any disputes shall be resolved through good-faith negotiation first, followed by binding arbitration if necessary.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">12. Contact</h2>
              <p className="text-sm leading-relaxed">For questions about these Terms of Service:</p>
              <div className="mt-3 bg-zinc-50 rounded-xl p-4 text-sm text-zinc-600 space-y-1">
                <p><span className="font-medium">Email:</span> ridoybaidya2@gmail.com</p>
                <p><span className="font-medium">GitHub:</span> github.com/rid-coder-70/spendex</p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex gap-4">
            <Link href="/privacy" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Privacy Policy →</Link>
            <Link href="/about" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">About Us →</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
