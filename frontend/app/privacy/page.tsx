import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 2, 2026';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10 pb-8 border-b border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Legal</p>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-3">Privacy Policy</h1>
            <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none space-y-8 text-zinc-700">

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">1. Introduction</h2>
              <p className="text-sm leading-relaxed">
                SpendGuard (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights. By using SpendGuard, you agree to the practices described here.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">2. Information We Collect</h2>
              <div className="space-y-3">
                <div className="bg-zinc-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-700 mb-1">Account Information</p>
                  <p className="text-sm text-zinc-500">Your name, email address, and hashed password when you register.</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-700 mb-1">Transaction Data</p>
                  <p className="text-sm text-zinc-500">Financial transactions you manually enter or upload via CSV. This includes amounts, dates, categories, and merchant names.</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-700 mb-1">Usage Data</p>
                  <p className="text-sm text-zinc-500">Anonymous usage statistics (page views, feature usage) to help us improve the product. No personally identifiable information is included.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">3. How We Use Your Data</h2>
              <ul className="space-y-2">
                {[
                  'Provide and operate the SpendGuard service',
                  'Authenticate you and maintain your session',
                  'Generate financial analytics and reports for your account',
                  'Send you monthly financial summary emails (if enabled)',
                  'Improve the platform based on anonymized usage data',
                  'Respond to your support requests',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">4. Data Security</h2>
              <p className="text-sm leading-relaxed mb-3">
                We take security seriously. All passwords are hashed using bcrypt before being stored. All API communications use HTTPS. Authentication uses short-lived JWT tokens.
              </p>
              <p className="text-sm leading-relaxed">
                We do not store raw payment credentials, bank account numbers, or any sensitive financial identifiers. Your transaction data is entered manually by you.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">5. Data Sharing</h2>
              <p className="text-sm leading-relaxed">
                We do not sell, rent, or share your personal data with third parties for advertising or marketing purposes. We do not use your financial data for any purpose other than operating your SpendGuard account.
              </p>
              <p className="text-sm leading-relaxed mt-3">
                We may share anonymized, aggregated statistics (e.g., &quot;platform users tracked ৳X this month&quot;) publicly. These statistics never identify individual users.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">6. Data Retention</h2>
              <p className="text-sm leading-relaxed">
                Your data is retained for as long as your account is active. If you delete your account, we will permanently delete all personal data and transaction records within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">7. Your Rights</h2>
              <ul className="space-y-2">
                {[
                  'Access: Request a copy of all data we hold about you',
                  'Correction: Update your name, email, or profile information',
                  'Deletion: Permanently delete your account and all associated data',
                  'Portability: Export your transaction data as CSV at any time',
                  'Opt-out: Unsubscribe from email reports at any time',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-zinc-500 mt-4">
                To exercise any of these rights, email us at{' '}
                <a href="mailto:ridoybaidya2@gmail.com" className="text-blue-600 hover:underline">ridoybaidya2@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">8. Cookies</h2>
              <p className="text-sm leading-relaxed">
                SpendGuard uses a single authentication cookie to keep you logged in between sessions. We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">9. Changes to This Policy</h2>
              <p className="text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you by email and update the &quot;Last updated&quot; date at the top of this page. Continued use of SpendGuard after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-900 mb-3">10. Contact</h2>
              <p className="text-sm leading-relaxed">
                If you have questions about this Privacy Policy or your data, please contact us:
              </p>
              <div className="mt-3 bg-zinc-50 rounded-xl p-4 text-sm text-zinc-600 space-y-1">
                <p><span className="font-medium">Email:</span> ridoybaidya2@gmail.com</p>
                <p><span className="font-medium">GitHub:</span> github.com/rid-coder-70/spendex</p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex gap-4">
            <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Terms of Service →</Link>
            <Link href="/about" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">About Us →</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
