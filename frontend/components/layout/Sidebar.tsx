'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  RefreshCcw, 
  Upload, 
  Settings,
  LogOut,
  Wallet,
  X
} from 'lucide-react';

import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from '@/lib/stores/toastStore';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: RefreshCcw },
  { name: 'Upload CSV', href: '/dashboard/upload', icon: Upload },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex flex-col h-full glass-dark text-slate-300 border-r border-slate-800/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-48 h-48 bg-primary-600/20 rounded-full blur-[80px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]" 
      />

      {/* Logo and Close Button */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20"
          >
            <Wallet className="w-6 h-6" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SpendGuard</h1>
            <p className="text-[10px] text-primary-400 uppercase tracking-widest font-bold">Premium Finance</p>
          </div>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* User Info */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mx-4 mb-6 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate text-sm">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10",
                  isActive ? "text-white" : "group-hover:text-primary-400"
                )} />
                <span className="font-bold text-sm relative z-10">{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff] relative z-10" 
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-slate-800/50">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-semibold text-sm">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}