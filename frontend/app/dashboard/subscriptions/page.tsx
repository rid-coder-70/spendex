'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCcw, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { subscriptionsAPI } from '@/lib/api';
import { Subscription } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from '@/lib/stores/toastStore';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        subscriptionsAPI.getAll(),
        subscriptionsAPI.getStats(),
      ]);

      if (subsRes.success) {
        setSubscriptions(subsRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async (id: number) => {
    if (!confirm('Are you sure you want to mark this subscription as cancelled?')) {
      return;
    }

    try {
      await subscriptionsAPI.update(id, { is_active: false });
      toast.success('Subscription cancelled successfully');
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleDetectSubscriptions = async () => {
    try {
      setIsLoading(true);
      await subscriptionsAPI.detect();
      toast.success('Subscription detection complete');
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to detect subscriptions:', error);
      toast.error('Failed to detect subscriptions');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading subscriptions...</p>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter((s) => s.is_active);
  const inactiveSubscriptions = subscriptions.filter((s) => !s.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            Track your recurring payments and subscriptions
          </p>
        </div>
        <Button onClick={handleDetectSubscriptions}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Detect Subscriptions
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total_subscriptions}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Active Subscriptions</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.active_subscriptions}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Monthly Cost</p>
                <p className="text-3xl font-bold text-primary-700">
                  {formatCurrency(stats.total_monthly_cost)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {subscription.merchant}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(subscription.amount)} / {subscription.frequency}
                      </p>
                      <p className="text-xs text-gray-500">
                        Next billing: {formatDate(subscription.next_billing_date || '')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelSubscription(subscription.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inactive Subscriptions */}
      {inactiveSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cancelled Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {subscription.merchant}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(subscription.amount)} / {subscription.frequency}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cancelled on: {formatDate(subscription.cancelled_at || '')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={RefreshCcw}
              title="No subscriptions detected"
              description="We haven't found any recurring subscriptions yet. Click 'Detect Subscriptions' to scan your transactions."
              action={{
                label: 'Detect Subscriptions',
                onClick: handleDetectSubscriptions,
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}