'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const fetchUser = async () => {
      if (!token) {
        router.push('/auth/login');
        return;
      }

      if (!user) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            router.push('/auth/login');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          router.push('/auth/login');
        }
      }
      setIsLoading(false);
      clearTimeout(timeout);
    };

    fetchUser();
    return () => clearTimeout(timeout);
  }, [token, user, setUser, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar Skeleton */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100 p-8 space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse"></div>
                <div className="h-3 w-32 bg-slate-50 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Skeleton */}
          <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
            <div className="h-4 w-48 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse"></div>
            </div>
          </header>

          {/* Page Content Skeleton */}
          <main className="flex-1 overflow-y-auto p-10">
            <div className="container mx-auto">
              <div className="h-8 w-64 bg-slate-200 rounded-full animate-pulse mb-4"></div>
              <div className="h-4 w-96 bg-slate-100 rounded-full animate-pulse mb-12"></div>
              
              <div className="grid grid-cols-4 gap-8 mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div className="h-3 w-20 bg-slate-50 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-mesh">
      {/* Desktop Sidebar - Static */}
      <aside className="hidden lg:block w-72 flex-shrink-0 relative z-30">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div key="mobile-sidebar-container">
            <motion.div 
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside 
              key="sidebar-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex-shrink-0 lg:hidden"
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}