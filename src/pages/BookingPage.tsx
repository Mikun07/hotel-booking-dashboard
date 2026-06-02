import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useRoomDetail } from '../features/rooms/hooks/useRoomDetail';
import BookingForm from '../features/bookings/components/BookingForm';
import Spinner from '../shared/ui/Spinner';
import { formatCurrency } from '../shared/utils/formatCurrency';

export default function BookingPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [sp] = useSearchParams();
  const { data: room, isLoading } = useRoomDetail(roomId);

  const initialDates = sp.get('checkIn') && sp.get('checkOut')
    ? { checkIn: sp.get('checkIn')!, checkOut: sp.get('checkOut')! }
    : undefined;

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!room) return <p className="text-center py-16 text-gray-500">Room not found.</p>;

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm shadow-gray-200">
        <div className="flex gap-4 items-center mb-4">
          {room.images[0] && (
            <img src={room.images[0]} alt={room.name} className="w-20 h-20 rounded-xl object-cover" />
          )}
          <div>
            <h2 className="font-bold text-blue-950">{room.name}</h2>
            <p className="text-gray-500 text-sm capitalize">{room.type.toLowerCase()} · {room.capacity} guests</p>
            <p className="font-semibold text-blue-950">{formatCurrency(room.pricePerNight)}<span className="text-gray-400 font-normal text-xs"> / night</span></p>
          </div>
        </div>
        <BookingForm room={room} initialDates={initialDates} />
      </div>
    </div>
  );
}
