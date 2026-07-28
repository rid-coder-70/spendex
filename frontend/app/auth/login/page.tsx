'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { authAPI } from '@/lib/api';
import { apiClient } from '@/lib/api/client';
import { validateEmail } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!validateEmail(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authAPI.login(formData);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        apiClient.setAuthCookie(res.data.token);
        router.push('/dashboard');
      } else {
        setApiError('Login failed. Please try again.');
      }
    } catch (error: any) {
      setApiError(error.response?.data?.error?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-0.5">Welcome back</h2>
      <p className="text-xs text-zinc-400 mb-5">Sign in to your SpendGuard account</p>

      {apiError && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-600 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn('input', errors.email && 'border-red-400 focus:border-red-400')}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-zinc-600 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn('input pr-10', errors.password && 'border-red-400 focus:border-red-400')}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {showPassword ? (
                  <motion.div
                    key="eye-off"
                    initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EyeOff size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Eye size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-2 justify-center mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in…
              </>
            ) : 'Sign in'}
          </span>
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        No account?{' '}
        <Link href="/auth/register" className="text-zinc-900 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}