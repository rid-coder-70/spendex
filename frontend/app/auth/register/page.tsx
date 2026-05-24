'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { authAPI } from '@/lib/api';
import { apiClient } from '@/lib/api/client';
import { validateEmail, validatePassword } from '@/lib/utils';
import { toast } from '@/lib/stores/toastStore';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Min 2 characters';
    if (!formData.email) e.email = 'Email is required';
    else if (!validateEmail(formData.email)) e.email = 'Invalid email';
    const pwVal = validatePassword(formData.password);
    if (!formData.password) e.password = 'Password is required';
    else if (!pwVal.valid) e.password = pwVal.errors[0];
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const res = await authAPI.register(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        apiClient.setAuthCookie(res.data.token);
        toast.success('Welcome to SpendGuard!');
        router.push('/dashboard');
      } else {
        const msg = res.message || 'Registration failed.';
        setApiError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Registration failed.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-0.5">Create account</h2>
      <p className="text-xs text-zinc-400 mb-5">Start managing your finances today</p>

      {apiError && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { id: 'name',            label: 'Full name',       type: 'text',     placeholder: 'John Doe' },
          { id: 'email',           label: 'Email',           type: 'email',    placeholder: 'you@example.com' },
          { id: 'password',        label: 'Password',        type: 'password', placeholder: '••••••••' },
          { id: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
            <input
              type={type}
              id={id}
              name={id}
              value={formData[id as keyof typeof formData]}
              onChange={handleChange}
              className={cn('input', errors[id as keyof typeof errors] && 'border-red-400 focus:border-red-400')}
              placeholder={placeholder}
            />
            {errors[id as keyof typeof errors] && (
              <p className="mt-1 text-xs text-red-500">{errors[id as keyof typeof errors]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-2 justify-center mt-1 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account…
            </>
          ) : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-zinc-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}