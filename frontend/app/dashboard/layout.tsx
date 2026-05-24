'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuthStore } from '@/lib/stores/authStore';
import { authAPI } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 5000);

    const fetchUser = async () => {
      if (!token) { router.push('/auth/login'); return; }
      if (!user) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            router.push('/auth/login');
          }
        } catch {
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
      <div className="flex h-screen bg-white">
        <aside className="hidden lg:block w-56 border-r border-zinc-100 p-4 space-y-2">
          <div className="h-8 skeleton w-32 mb-6" />
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-2 px-2 py-2">
              <div className="w-4 h-4 skeleton rounded" />
              <div className="h-3 skeleton w-24 rounded" />
            </div>
          ))}
        </aside>
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-zinc-100 px-4 flex items-center gap-3">
            <div className="h-7 skeleton w-48 rounded-lg" />
            <div className="ml-auto w-7 h-7 skeleton rounded-full" />
          </div>
          <main className="flex-1 p-6">
            <div className="h-6 skeleton w-48 rounded mb-6" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}
            </div>
            <div className="h-64 skeleton rounded-xl" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-56 lg:hidden">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}