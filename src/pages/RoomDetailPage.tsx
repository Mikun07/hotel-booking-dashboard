import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useRoomDetail } from '../features/rooms/hooks/useRoomDetail';
import Spinner from '../shared/ui/Spinner';
import { formatCurrency } from '../shared/utils/formatCurrency';
import Button from '../shared/ui/Button';
import { useAuth } from '../shared/hooks/useAuth';

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const { data: room, isLoading } = useRoomDetail(id);
  const { isAuthenticated } = useAuth();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!room) return <p className="text-center py-16 text-gray-500">Room not found.</p>;

  const bookingQuery = sp.get('checkIn') && sp.get('checkOut') && sp.get('guests')
    ? `?checkIn=${sp.get('checkIn')}&checkOut=${sp.get('checkOut')}&guests=${sp.get('guests')}`
    : '';

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl">
      {/* Image gallery */}
      <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden">
        {room.images.slice(0, 4).map((img, i) => (
          <img key={i} src={img} alt={room.name} className={`w-full object-cover ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`} />
        ))}
        {room.images.length === 0 && (
          <div className="col-span-2 h-64 bg-gradient-to-br from-blue-950 to-blue-800 flex flex-col items-center justify-center text-white/40 rounded-3xl gap-2">
            <ion-icon name="image-outline" style={{ fontSize: '40px' }} />
            <span className="text-sm">No images available</span>
          </div>
        )}
      </div>

      {/* Details card */}
      <div className="flex flex-col gap-5 bg-white rounded-3xl p-6 shadow-md shadow-gray-200/60 border border-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full capitalize">{room.type.toLowerCase()}</span>
              {room.status === 'AVAILABLE' ? (
                <span className="text-xs font-semibold bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Available
                </span>
              ) : (
                <span className="text-xs font-semibold bg-red-50 text-red-500 px-2.5 py-0.5 rounded-full capitalize">{room.status.toLowerCase()}</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">{room.name}</h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><ion-icon name="business-outline" style={{ fontSize: '13px' }} /> Floor {room.floor}</span>
              <span className="flex items-center gap-1"><ion-icon name="people-outline" style={{ fontSize: '13px' }} /> Up to {room.capacity} guests</span>
            </p>
          </div>
          <div className="text-right bg-blue-950 rounded-2xl px-5 py-3">
            <p className="text-2xl font-extrabold text-white">{formatCurrency(room.pricePerNight)}</p>
            <p className="text-white/50 text-xs">per night</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
        </div>

        {room.amenities.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ion-icon name="sparkles-outline" style={{ fontSize: '15px', color: '#f59e0b' }} />
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map(a => (
                <span key={a} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-xl font-medium">{a}</span>
              ))}
            </div>
          </div>
        )}

        {isAuthenticated ? (
          <Link to={`/book/${room.id}${bookingQuery}`}>
            <Button size="lg" className="w-full mt-1 !bg-amber-400 !text-gray-900 hover:!bg-amber-300 font-bold">
              <ion-icon name="calendar-outline" style={{ fontSize: '17px' }} />
              Book Now
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="lg" className="w-full mt-1">
              <ion-icon name="log-in-outline" style={{ fontSize: '17px' }} />
              Sign in to Book
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
