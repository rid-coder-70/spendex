'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CategoryBreakdown } from '@/types';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

const COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#10b981',
  '#f59e0b', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-slate-100 shadow-2xl rounded-2xl">
        <p className="text-sm font-black text-slate-900 mb-1">{data.name}</p>
        <p className="text-xs font-bold text-primary-600 mb-2">{data.percentage.toFixed(1)}% of total</p>
        <p className="text-lg font-black text-slate-900">৳{data.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    name: item.category_name,
    value: item.total_amount,
    percentage: item.percentage,
  }));

  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40">
      <CardHeader className="px-10 pt-10">
        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Spending Breakdown</CardTitle>
        <p className="text-sm text-slate-400 font-medium">Distribution by category</p>
      </CardHeader>
      <CardContent className="px-6 pb-10 flex flex-col md:flex-row items-center gap-8">
        <div className="h-[300px] w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="none"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 space-y-3">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-black text-slate-900">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}