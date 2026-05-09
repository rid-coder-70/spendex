import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-5xl mb-3">💰</div>
            <h1 className="text-3xl font-bold text-primary-800">SpendGuard</h1>
            <p className="text-gray-600 mt-1">Your Personal Finance Manager</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-medium p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 SpendGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
}