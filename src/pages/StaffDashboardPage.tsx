import React, { useState } from 'react';
import ArrivalsTable from '../features/staff-dashboard/components/ArrivalsTable';
import { useTodaysArrivals, useCheckIn, useCheckOut } from '../features/staff-dashboard/hooks/useArrivals';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../features/staff-dashboard/api/staffApi';
import { queryKeys } from '../services/queryKeys';
import BookingCard from '../features/bookings/components/BookingCard';
import Spinner from '../shared/ui/Spinner';
import type { BookingStatus } from '../shared/types/booking.types';
import Select from '../shared/ui/Select';

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CHECKED_IN', label: 'Checked In' },
  { value: 'CHECKED_OUT', label: 'Checked Out' },
];

export default function StaffDashboardPage() {
  const [tab, setTab] = useState<'arrivals' | 'all'>('arrivals');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');

  const { data: arrivalsData, isLoading: arrivalsLoading } = useTodaysArrivals();
  const { mutate: checkIn } = useCheckIn();
  const { mutate: checkOut } = useCheckOut();

  const { data: allBookings, isLoading: allLoading } = useQuery({
    queryKey: queryKeys.staff.allBookings({ status: statusFilter || undefined }),
    queryFn: () => staffApi.getAllBookings({ status: statusFilter as BookingStatus || undefined }),
    enabled: tab === 'all',
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      <h1 className="text-2xl font-bold text-blue-950">Staff Dashboard</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('arrivals')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'arrivals' ? 'bg-blue-950 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          Today's Arrivals ({arrivalsData?.total ?? 0})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'all' ? 'bg-blue-950 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          All Reservations
        </button>
      </div>

      {tab === 'arrivals' && (
        <ArrivalsTable
          arrivals={arrivalsData?.items ?? []}
          isLoading={arrivalsLoading}
          onCheckIn={checkIn}
        />
      )}

      {tab === 'all' && (
        <div className="flex flex-col gap-4">
          <div className="w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as BookingStatus | '')}
            />
          </div>
          {allLoading && <div className="flex justify-center py-8"><Spinner /></div>}
          <div className="flex flex-col gap-3">
            {(allBookings?.items ?? []).map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
          {!allLoading && (allBookings?.items ?? []).length === 0 && (
            <p className="text-gray-500 text-sm py-4">No reservations found.</p>
          )}
        </div>
      )}

      {/* Quick check-out from arrivals */}
      {tab === 'arrivals' && (arrivalsData?.items ?? []).some(a => a.status === 'CHECKED_IN') && (
        <div className="mt-4">
          <h3 className="font-semibold text-blue-950 mb-3">Process Check-Out</h3>
          <div className="flex flex-col gap-2">
            {(arrivalsData?.items ?? []).filter(a => a.status === 'CHECKED_IN').map(a => (
              <div key={a.bookingId} className="flex items-center justify-between bg-white rounded-xl border p-3">
                <span className="text-sm font-medium">{a.guestName} — {a.roomName}</span>
                <button
                  onClick={() => checkOut(a.bookingId)}
                  className="text-sm bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                >
                  Check Out
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
