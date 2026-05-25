'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from '@/lib/stores/toastStore';
import { authAPI } from '@/lib/api';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    emailNotifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currency: user.currency || 'BDT',
        timezone: user.timezone || 'Asia/Dhaka',
        emailNotifications: user.email_notifications ?? true,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await authAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        currency: formData.currency,
        timezone: formData.timezone,
        email_notifications: formData.emailNotifications,
      });
      if (res.success && res.data) {
        setUser(res.data);
        toast.success('Settings saved');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl pb-8">
      <div>
        <h1 className="text-base font-semibold text-zinc-900">Settings</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Manage your account preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </Field>
          </div>
          <Field label="Phone">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+880..."
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Currency">
              <select
                name="currency"
                className="input"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="BDT">BDT — Bangladeshi Taka (৳)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select
                name="timezone"
                className="input"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              </select>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900">Email reports</p>
              <p className="text-xs text-zinc-400 mt-0.5">Monthly financial summaries via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:bg-zinc-900
                             after:content-[''] after:absolute after:top-0.5 after:left-0.5
                             after:bg-white after:rounded-full after:h-4 after:w-4
                             after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-1">
        <Button onClick={handleSave} isLoading={isSaving}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      <div className="border border-red-200 rounded-xl p-4 bg-red-50">
        <h3 className="text-sm font-semibold text-red-600 mb-1">Danger zone</h3>
        <p className="text-xs text-red-500 mb-3">Deleting your account is irreversible.</p>
        <Button variant="danger">Delete account</Button>
      </div>
    </div>
  );
}
