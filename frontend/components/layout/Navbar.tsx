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
    { name: 'Features', href: '/features' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 backdrop-blur-sm border-b border-zinc-200 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — scale + glow on hover */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300',
            'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.45)]',
            isScrolled ? 'bg-zinc-900' : 'bg-white/15 border border-white/20'
          )}>
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={cn(
            'text-sm font-semibold transition-all duration-300 group-hover:tracking-wide',
            isScrolled ? 'text-zinc-900' : 'text-white'
          )}>
            SpendGuard
          </span>
        </Link>

        {/* Desktop nav links — sliding underline + active dot */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 group',
                    isScrolled
                      ? isActive
                        ? 'text-zinc-900'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                      : isActive
                        ? 'text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className={cn(
                      'absolute top-1 right-1 w-1 h-1 rounded-full',
                      isScrolled ? 'bg-blue-500' : 'bg-white'
                    )} />
                  )}
                  {link.name}
                  {/* Sliding underline on hover / active */}
                  <span className={cn(
                    'absolute bottom-0.5 left-3 right-3 h-[1.5px] rounded-full origin-left transition-transform duration-300 ease-out',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    isScrolled ? 'bg-zinc-800' : 'bg-white'
                  )} />
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side CTAs */}
        <div className="hidden md:flex items-center gap-1.5">
          {mounted && isAuthenticated ? (
            <Link href="/dashboard" className="btn-primary px-3 py-1.5">
              <span className="relative z-10">Dashboard</span>
            </Link>
          ) : (
            <>
              {/* Sign In — border reveals on hover */}
              <Link
                href="/auth/login"
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-300 active:scale-[0.96]',
                  isScrolled
                    ? 'text-zinc-600 border-transparent hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                    : 'text-white/80 border-transparent hover:border-white/25 hover:bg-white/10 hover:text-white'
                )}
              >
                Sign in
              </Link>
              {/* Get started */}
              <Link
                href="/auth/register"
                className={cn('btn-primary px-3 py-1.5', !isScrolled && 'bg-white !text-zinc-900')}
              >
                <span className="relative z-10">Get started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'md:hidden p-1.5 rounded-lg transition-all duration-200 active:scale-90',
            isScrolled ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white hover:bg-white/10'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-0.5 shadow-lg">
          {!isAuthPage && navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center justify-between py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-zinc-900 bg-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </Link>
            );
          })}
          <div className="pt-3 mt-1 border-t border-zinc-100 flex flex-col gap-2">
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-primary py-2 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2.5 px-3 text-center text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary py-2 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10">Get started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}