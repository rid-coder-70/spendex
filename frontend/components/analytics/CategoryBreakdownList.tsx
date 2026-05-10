'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CategoryBreakdown } from '@/types';
import { formatCurrency } from '@/lib/utils';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface CategoryBreakdownListProps {
  data: CategoryBreakdown[];
}

export default function CategoryBreakdownList({ data }: CategoryBreakdownListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.category_id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-md"
                    style={{ 
                      backgroundColor: item.category_color ? `${item.category_color}20` : '#3b82f620', 
                      color: item.category_color || '#3b82f6' 
                    }}
                  >
                    <CategoryIcon iconName={item.category_icon} className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-900">{item.category_name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.total_amount)}
                  </span>
                  <p className="text-xs text-gray-500">
                    {item.transaction_count} transactions
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: item.category_color || '#3b82f6'
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                <span>{item.percentage.toFixed(1)}% of expenses</span>
                <span>Avg: {formatCurrency(item.average_amount)}</span>
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
