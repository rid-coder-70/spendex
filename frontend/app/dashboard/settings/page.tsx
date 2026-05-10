'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from '@/lib/stores/toastStore';
import { authAPI } from '@/lib/api';

import { motion } from 'framer-motion';

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
    setFormData((prev) => ({
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
        toast.success('Settings saved successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-3">Personalize your SpendGuard experience</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field bg-slate-50/50 border-slate-100 focus:bg-white"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field bg-slate-50/50 border-slate-100 focus:bg-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field bg-slate-50/50 border-slate-100 focus:bg-white"
                placeholder="+88017..."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900">Local Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Currency</label>
                <select
                  name="currency"
                  className="input-field bg-slate-50/50 border-slate-100 focus:bg-white appearance-none cursor-pointer"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="BDT">BDT - Bangladeshi Taka (৳)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                <select
                  name="timezone"
                  className="input-field bg-slate-50/50 border-slate-100 focus:bg-white appearance-none cursor-pointer"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
              <div>
                <p className="font-extrabold text-slate-900">Email Reports</p>
                <p className="text-sm text-slate-500 font-medium">Receive monthly financial summaries via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 shadow-inner"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          className="px-12 py-4 text-lg rounded-2xl shadow-2xl shadow-primary-600/30"
        >
          {isSaving ? 'Saving Changes...' : 'Save All Preferences'}
        </Button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants} className="pt-10">
        <div className="p-10 bg-red-50/50 border border-red-100 rounded-[2.5rem] space-y-6">
          <div>
            <h3 className="text-2xl font-black text-red-600">Danger Zone</h3>
            <p className="text-red-700/60 font-medium mt-1">Once you delete your account, all data is gone forever.</p>
          </div>
          <Button variant="danger" className="rounded-2xl px-10">
            Permanently Delete Account
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
