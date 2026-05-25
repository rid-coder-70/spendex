import React from 'react';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-900">SpendGuard</span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[180px]">
              Track, analyze, and optimize your spending habits.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900 mb-3">Product</p>
            <ul className="space-y-2">
              {['Features', 'How it Works', 'Pricing', 'Dashboard'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900 mb-3">Company</p>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900 mb-3">Stay updated</p>
            <p className="text-xs text-zinc-500 mb-3">Financial tips and product updates.</p>
            <form className="flex gap-1.5">
              <input
                type="email"
                placeholder="Email address"
                className="input text-xs py-1.5 flex-1"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">© {year} SpendGuard. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link key={item} href="#" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
