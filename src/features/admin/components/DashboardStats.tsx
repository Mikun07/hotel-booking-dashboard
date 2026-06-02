import React from 'react';
import type { DashboardStats } from '../api/adminApi';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import Spinner from '../../../shared/ui/Spinner';

interface Props { stats: DashboardStats | undefined; isLoading: boolean; }

export default function DashboardStats({ stats, isLoading }: Props) {
  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;
  if (!stats) return null;

  const cards = [
    { label: "Today's Bookings", value: stats.totalBookingsToday, color: 'bg-blue-50 text-blue-950' },
    { label: 'Active Bookings', value: stats.totalActiveBookings, color: 'bg-green-50 text-green-800' },
    { label: 'Occupancy Rate', value: `${(stats.occupancyRate * 100).toFixed(0)}%`, color: 'bg-purple-50 text-purple-800' },
    { label: 'Revenue This Month', value: formatCurrency(stats.revenueThisMonth), color: 'bg-yellow-50 text-yellow-800' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
          <p className="text-xs font-medium opacity-70">{c.label}</p>
          <p className="text-2xl font-bold mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
