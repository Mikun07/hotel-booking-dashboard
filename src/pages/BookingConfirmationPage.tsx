import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookingDetail } from '../features/bookings/hooks/useGuestBookings';
import BookingStatusBadge from '../features/bookings/components/BookingStatusBadge';
import Spinner from '../shared/ui/Spinner';
import Button from '../shared/ui/Button';
import { formatDate } from '../shared/utils/formatDate';
import { formatCurrency } from '../shared/utils/formatCurrency';

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading } = useBookingDetail(id);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!booking) return <p className="text-center py-16 text-gray-500">Booking not found.</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 pb-12 items-center text-center">
      {/* Success icon */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
          <ion-icon name="checkmark-outline" style={{ fontSize: '36px', color: '#fff' }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Booking Confirmed!</h1>
          <p className="text-gray-400 text-sm mt-1">A confirmation has been sent to your email.</p>
        </div>
      </div>

      {/* Confirmation card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/60 w-full text-left overflow-hidden">
        {/* Header bar */}
        <div className="bg-blue-950 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Reference</p>
            <p className="text-white font-mono font-bold text-sm">{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Room</p>
            <h2 className="font-extrabold text-gray-900 text-base">{booking.room.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Check-in', value: formatDate(booking.checkInDate), icon: 'log-in-outline' },
              { label: 'Check-out', value: formatDate(booking.checkOutDate), icon: 'log-out-outline' },
              { label: 'Guests', value: String(booking.guestsCount), icon: 'people-outline' },
              { label: 'Total', value: formatCurrency(booking.totalPrice), icon: 'card-outline', bold: true },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                  <ion-icon name={item.icon} style={{ fontSize: '12px' }} />
                  <p className="text-[11px] uppercase tracking-wide">{item.label}</p>
                </div>
                <p className={`text-sm ${item.bold ? 'font-extrabold text-blue-950 text-base' : 'font-semibold text-gray-800'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {booking.specialRequests && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-left">
              <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                <ion-icon name="chatbubble-ellipses-outline" style={{ fontSize: '13px' }} />
                Special Requests
              </p>
              <p className="text-sm text-gray-700">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Link to="/dashboard" className="flex-1">
          <Button variant="secondary" className="w-full">My Bookings</Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full !bg-amber-400 !text-gray-900 hover:!bg-amber-300 font-bold">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
