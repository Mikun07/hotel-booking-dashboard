import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoomSummary, SearchParams } from '../../../shared/types/room.types';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

const fallbackImages = [
  new URL('../../../assets/img/H1.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-2.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-3.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-4.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-5.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-6.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-7.jpeg', import.meta.url).href,
  new URL('../../../assets/img/Hotel-8.jpeg', import.meta.url).href,
];

function seededFallback(id: string) {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return fallbackImages[n % fallbackImages.length];
}

interface RoomCardProps {
  room: RoomSummary;
  searchParams?: SearchParams;
}

export default function RoomCard({ room, searchParams }: RoomCardProps) {
  const navigate = useNavigate();
  const img = room.primaryImage || seededFallback(room.id);

  const handleSelect = () => {
    const query = searchParams
      ? `?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`
      : '';
    navigate(`/rooms/${room.id}${query}`);
  };

  return (
    <div
      onClick={handleSelect}
      className="group bg-white rounded-2xl overflow-hidden shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col cursor-pointer hover:shadow-xl hover:shadow-gray-200 transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={img}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = fallbackImages[0]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize shadow-sm">
          {room.type.toLowerCase()}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-bold text-gray-900 text-sm leading-snug">{room.name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <ion-icon name="people-outline" style={{ fontSize: '13px' }} />
          Up to {room.capacity} guests
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {room.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">{a}</span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{room.amenities.length - 3} more</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="font-extrabold text-blue-950 text-base">{formatCurrency(room.pricePerNight)}</span>
            <span className="text-gray-400 text-xs"> / night</span>
          </div>
          <span className="text-xs font-semibold text-amber-500 group-hover:text-amber-600 flex items-center gap-0.5 transition-colors">
            View Room <ion-icon name="arrow-forward-outline" style={{ fontSize: '13px' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
