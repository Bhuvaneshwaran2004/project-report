import React from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Percent, Scale, Wallet, TrendingDown } from 'lucide-react';
import type { FinancialMetrics } from '../types/financial';

interface MetricsDisplayProps {
  metrics: FinancialMetrics | null;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  if (!metrics) return null;

  const sections = [
    {
      title: 'Key Metrics',
      metrics: [
        { title: 'Revenue', value: metrics.revenue, icon: DollarSign },
        { title: 'Net Income', value: metrics.netIncome, icon: TrendingUp },
        { title: 'EPS', value: metrics.eps, icon: BarChart3 },
        { title: 'P/E Ratio', value: metrics.peRatio, icon: PieChart }
      ]
    },
    {
      title: 'Profitability',
      metrics: [
        { title: 'Gross Margin', value: metrics.grossMargin, icon: Percent },
        { title: 'Operating Margin', value: metrics.operatingMargin, icon: Percent },
        { title: 'Net Profit Margin', value: metrics.netProfitMargin, icon: Percent }
      ]
    },
    {
      title: 'Financial Health',
      metrics: [
        { title: 'Current Ratio', value: metrics.currentRatio, icon: Scale },
        { title: 'Debt to Equity', value: metrics.debtToEquity, icon: Wallet },
        { title: 'Interest Coverage', value: metrics.interestCoverage, icon: TrendingDown }
      ]
    }
  ];

  return (
    <div className="space-y-8 mt-8">
      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.metrics.map(metric => (
              <div key={metric.title} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
                  <metric.icon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}