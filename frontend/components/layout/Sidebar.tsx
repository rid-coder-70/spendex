'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { name: 'Dashboard',     href: '/dashboard',                icon: Home },
  { name: 'Transactions',  href: '/dashboard/transactions',   icon: CreditCard },
  { name: 'Analytics',     href: '/dashboard/analytics',      icon: TrendingUp },
  { name: 'Subscriptions', href: '/dashboard/subscriptions',  icon: RefreshCcw },
  { name: 'Upload CSV',    href: '/dashboard/upload',         icon: Upload },
  { name: 'Settings',      href: '/dashboard/settings',       icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-100 text-zinc-700">

      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-100 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900">SpendGuard</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-zinc-400 hover:text-zinc-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User pill */}
      <div className="px-3 py-3 border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-zinc-50">
          <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate leading-none">{user?.name || '—'}</p>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="section-label px-2 mb-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                isActive ? 'nav-item-active' : 'nav-item'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-zinc-100 shrink-0">
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}