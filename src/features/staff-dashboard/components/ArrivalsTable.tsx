import React from 'react';
import type { ArrivalSummary } from '../../../shared/types/booking.types';
import { formatDate } from '../../../shared/utils/formatDate';
import Button from '../../../shared/ui/Button';
import Spinner from '../../../shared/ui/Spinner';

interface Props {
  arrivals: ArrivalSummary[];
  onCheckIn: (bookingId: string) => void;
  isLoading: boolean;
}

export default function ArrivalsTable({ arrivals, onCheckIn, isLoading }: Props) {
  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;
  if (arrivals.length === 0) return <p className="text-gray-500 text-sm py-4">No arrivals today.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Guest</th>
            <th className="text-left px-4 py-3 font-medium">Room</th>
            <th className="text-left px-4 py-3 font-medium">Check-out</th>
            <th className="text-left px-4 py-3 font-medium">Guests</th>
            <th className="text-left px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.map(a => (
            <tr key={a.bookingId} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-blue-950">{a.guestName}</td>
              <td className="px-4 py-3">{a.roomNumber} — {a.roomName}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(a.checkOutDate)}</td>
              <td className="px-4 py-3">{a.guestsCount}</td>
              <td className="px-4 py-3">
                {a.status === 'CONFIRMED' && (
                  <Button size="sm" onClick={() => onCheckIn(a.bookingId)}>Check In</Button>
                )}
                {a.status === 'CHECKED_IN' && (
                  <span className="text-green-600 text-xs font-medium">Checked In</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
