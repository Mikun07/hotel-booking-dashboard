import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../features/rooms/components/RoomCard';
import RoomFilters from '../features/rooms/components/RoomFilters';
import RoomSearchForm from '../features/rooms/components/RoomSearchForm';
import { useRoomSearch } from '../features/rooms/hooks/useRoomSearch';
import Spinner from '../shared/ui/Spinner';
import Pagination from '../shared/ui/Pagination';
import type { SearchParams, RoomType } from '../shared/types/room.types';

const LIMIT = 9;

export default function SearchResultsPage() {
  const [sp] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ roomType?: RoomType; minPrice?: number; maxPrice?: number }>({});

  const searchParams: SearchParams | null = sp.get('checkIn') && sp.get('checkOut') && sp.get('guests')
    ? {
        checkIn: sp.get('checkIn')!,
        checkOut: sp.get('checkOut')!,
        guests: Number(sp.get('guests')),
        ...filters,
      }
    : null;

  const { data, isLoading, isFetching } = useRoomSearch(searchParams);
  const rooms = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="bg-white rounded-2xl p-4 shadow-sm shadow-gray-200">
        <RoomSearchForm
          defaultValues={searchParams ?? undefined}
          onSearch={params => {
            const url = new URL(window.location.href);
            url.searchParams.set('checkIn', params.checkIn);
            url.searchParams.set('checkOut', params.checkOut);
            url.searchParams.set('guests', String(params.guests));
            window.history.pushState({}, '', url);
            setPage(1);
          }}
        />
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <RoomFilters {...filters} onChange={f => { setFilters(f); setPage(1); }} />
        </aside>

        <div className="flex-1">
          {(isLoading || isFetching) && <div className="flex justify-center py-8"><Spinner /></div>}
          {!isLoading && rooms.length === 0 && searchParams && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No rooms available</p>
              <p className="text-sm mt-1">Try different dates or fewer guests.</p>
            </div>
          )}
          {!isLoading && !searchParams && (
            <p className="text-gray-500 text-sm py-4">Enter your dates above to search for available rooms.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.slice((page - 1) * LIMIT, page * LIMIT).map(room => (
              <RoomCard key={room.id} room={room} searchParams={searchParams ?? undefined} />
            ))}
          </div>
          <Pagination currentPage={page} totalItems={total} itemsPerPage={LIMIT} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
