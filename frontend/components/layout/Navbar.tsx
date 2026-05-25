'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/authStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      isScrolled
        ? 'bg-white border-b border-zinc-200'
        : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={cn(
            'text-sm font-semibold transition-colors',
            isScrolled ? 'text-zinc-900' : 'text-white'
          )}>
            SpendGuard
          </span>
        </Link>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-sm transition-colors',
                  isScrolled ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/70 hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-2">
          {mounted && isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  isScrolled ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white/80 hover:text-white'
                )}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 text-sm font-medium bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className={cn('md:hidden p-1.5 rounded-lg', isScrolled ? 'text-zinc-600' : 'text-white')}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-1">
          {!isAuthPage && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-2 text-sm text-zinc-600 hover:text-zinc-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="py-2 text-center text-sm font-medium bg-zinc-900 text-white rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2 text-center text-sm text-zinc-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="py-2 text-center text-sm font-medium bg-zinc-900 text-white rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}