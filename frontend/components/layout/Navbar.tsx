'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Menu, X } from 'lucide-react';
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-soft py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity duration-300">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Wallet className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight transition-colors duration-300",
            isScrolled ? "text-slate-900" : "text-white"
          )}>
            SpendGuard
          </span>
        </Link>

        {/* Desktop Nav */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 transform hover:text-primary-500 hover:-translate-y-0.5 hover:scale-105 inline-block",
                  isScrolled ? "text-slate-600" : "text-white/80"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-600/40 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105",
                  isScrolled 
                    ? "text-slate-700 hover:bg-slate-100" 
                    : "text-white hover:bg-white/10"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-600/40 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 transition-all duration-300 hover:scale-110 hover:bg-slate-500/10 rounded-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 transition-transform duration-300 hover:rotate-90" /> : <Menu className={cn("w-6 h-6 transition-transform duration-300", isScrolled ? "text-slate-900" : "text-white")} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-6 md:hidden animate-slide-down">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-slate-600 hover:text-primary-600 transition-all duration-300 transform hover:translate-x-2 inline-block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-100" />
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full py-4 text-center font-bold bg-primary-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary-700 hover:shadow-primary-600/40"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-lg font-medium text-slate-600 hover:text-primary-600 transition-all duration-300 transform hover:translate-x-2 inline-block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full py-3 text-center font-bold bg-primary-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary-700 hover:shadow-primary-600/40"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}