import React from 'react';
import { Link } from 'react-router-dom';
import type { BookingDetail } from '../../../shared/types/booking.types';
import { formatDate } from '../../../shared/utils/formatDate';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import BookingStatusBadge from './BookingStatusBadge';
import Button from '../../../shared/ui/Button';
import { useCancelBooking } from '../hooks/useCancelBooking';

interface Props { booking: BookingDetail; }

const cancellable: BookingDetail['status'][] = ['PENDING', 'CONFIRMED'];

export default function BookingCard({ booking }: Props) {
  const { mutate: cancel, isPending } = useCancelBooking();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-blue-950">{booking.room.name}</p>
          <p className="text-xs text-gray-500 capitalize">{booking.room.type.toLowerCase()} · {booking.room.roomNumber}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>
      <div className="flex gap-4 text-sm text-gray-600">
        <span>Check-in: <strong>{formatDate(booking.checkInDate)}</strong></span>
        <span>Check-out: <strong>{formatDate(booking.checkOutDate)}</strong></span>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-blue-950">{formatCurrency(booking.totalPrice)}</p>
        <div className="flex gap-2">
          <Link to={`/bookings/${booking.id}`}>
            <Button variant="ghost" size="sm">Details</Button>
          </Link>
          {cancellable.includes(booking.status) && (
            <Button variant="danger" size="sm" loading={isPending} onClick={() => cancel(booking.id)}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
