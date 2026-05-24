import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, CreditCard, Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { transactionsAPI } from '@/lib/api';
import { Transaction } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Transaction[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length > 1) {
        try {
          const res = await transactionsAPI.getAll({ merchant: query, limit: 5 });
          if (res.success) {
            setResults(res.data.items || []);
            setShowResults(true);
          }
        } catch {}
      } else {
        setResults([]);
        setShowResults(false);
      }
    };
    const t = setTimeout(search, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/dashboard/transactions?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setQuery('');
    }
  };

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Subscription Detected', message: 'We found a new recurring charge for Netflix.', time: '2h ago', unread: true },
    { id: 2, title: 'Monthly Budget Alert', message: 'You reached 80% of your Food & Dining budget.', time: '5h ago', unread: true },
    { id: 3, title: 'Weekly Summary Ready', message: 'Your financial overview for last week is ready.', time: '1d ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  const markAsRead = (id: number) => setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <header className="h-14 bg-white border-b border-zinc-100 px-4 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-xs relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => query.length > 1 && setShowResults(true)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-zinc-400 transition-colors"
          />
        </div>

        {/* Dropdown results */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in">
            <div className="px-3 py-2 border-b border-zinc-100">
              <p className="section-label">Results</p>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {results.map((tx) => (
                <Link
                  key={tx.id}
                  href="/dashboard/transactions"
                  onClick={() => setShowResults(false)}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 truncate max-w-[140px]">{tx.merchant || tx.description}</p>
                      <p className="text-[11px] text-zinc-400">{tx.category_name}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">৳{tx.amount.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 ml-auto">

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              'relative p-1.5 rounded-lg transition-colors',
              showNotifications ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
            )}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in">
              <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">Notifications</p>
                {unreadCount > 0 && (
                  <span className="badge bg-blue-50 text-blue-600">{unreadCount} new</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      'px-4 py-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-0',
                      n.unread && 'bg-blue-50/30'
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                      <span className="text-[11px] text-zinc-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
              {unreadCount > 0 && (
                <div className="px-4 py-2.5 border-t border-zinc-100 bg-zinc-50">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-zinc-200 mx-1 hidden sm:block" />

        {/* User */}
        <Link href="/dashboard/settings" className="flex items-center gap-2 pl-1 group">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-zinc-800 leading-none">{user?.name}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{user?.currency || 'BDT'}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
        </Link>
      </div>
    </header>
  );
}