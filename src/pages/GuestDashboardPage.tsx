import React, { useState } from 'react';
import { useGuestBookings } from '../features/bookings/hooks/useGuestBookings';
import BookingCard from '../features/bookings/components/BookingCard';
import Spinner from '../shared/ui/Spinner';
import Pagination from '../shared/ui/Pagination';
import { useAuth } from '../shared/hooks/useAuth';
import type { BookingDetail } from '../shared/types/booking.types';

const LIMIT = 8;
const upcoming: BookingDetail['status'][] = ['PENDING', 'CONFIRMED', 'CHECKED_IN'];

export default function GuestDashboardPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data, isLoading } = useGuestBookings({ skip: (page - 1) * LIMIT, limit: LIMIT });
  const bookings = data?.items ?? [];

  const filtered = bookings.filter(b =>
    tab === 'upcoming' ? upcoming.includes(b.status) : !upcoming.includes(b.status)
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Bookings</h1>
          {user && <p className="text-gray-400 text-sm mt-0.5">Welcome back, {user.firstName}.</p>}
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1">
          {(['upcoming', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-150 ${
                tab === t ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-12"><Spinner /></div>}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 text-center gap-3">
          <ion-icon name="calendar-outline" style={{ fontSize: '40px', color: '#d1d5db' }} />
          <p className="text-gray-400 text-sm font-medium">No {tab} bookings found.</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
      </div>
      <Pagination currentPage={page} totalItems={data?.total ?? 0} itemsPerPage={LIMIT} onPageChange={setPage} />
    </div>
  );
}
