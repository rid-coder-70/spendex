import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, CreditCard, Menu } from 'lucide-react';
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
    const searchTransactions = async () => {
      if (query.length > 1) {
        try {
          const res = await transactionsAPI.getAll({ merchant: query, limit: 5 });
          if (res.success) {
            setResults(res.data.items || []);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Search failed:', error);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchTransactions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/dashboard/transactions?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setQuery('');
    }
  };

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Subscription Detected', message: 'We found a new recurring charge for Netflix.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Monthly Budget Alert', message: 'You have reached 80% of your Food & Dining budget.', time: '5 hours ago', unread: true },
    { id: 3, title: 'Weekly Summary Ready', message: 'Your financial overview for last week is now available.', time: '1 day ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <header className="bg-white/40 backdrop-blur-xl border-b border-white/40 px-4 md:px-10 py-5 sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => query.length > 1 && setShowResults(true)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-3xl overflow-hidden z-50 animate-scale-in">
              <div className="p-4 border-b border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Results</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.map((tx) => (
                  <Link
                    key={tx.id}
                    href="/dashboard/transactions"
                    onClick={() => setShowResults(false)}
                    className="flex items-center justify-between p-4 hover:bg-primary-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                        <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{tx.merchant || tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.category_name}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-slate-900">৳{tx.amount.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "relative p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95",
                showNotifications ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="fixed md:absolute top-[80px] md:top-full left-4 right-4 md:left-auto md:right-0 md:w-96 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] overflow-hidden z-50 animate-scale-in origin-top-right">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-[10px] font-black rounded-md uppercase tracking-wider">{unreadCount} New</span>
                  )}
                </div>
                <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={cn(
                        "p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer group",
                        n.unread && "bg-primary-50/30"
                      )}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-black text-slate-900 group-hover:text-primary-600 transition-colors">{n.title}</p>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                        {n.unread && <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2"></div>}
                      </div>
                    ))
                  )}
                </div>
                {unreadCount > 0 && (
                  <div className="p-4 text-center bg-slate-50/50">
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          {/* User Menu */}
          <Link href="/dashboard/settings" className="flex items-center gap-3 md:gap-4 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{user?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{user?.currency || 'BDT'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-0.5 shadow-lg group-hover:scale-105 transition-transform group-active:scale-95">
              <div className="w-full h-full rounded-[10px] bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-sm uppercase">
                {user?.name ? user.name.charAt(0) : <User className="w-5 h-5" />}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}