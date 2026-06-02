import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { queryKeys } from '../../../services/queryKeys';

export function useGuestBookings(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => bookingsApi.list(params),
    staleTime: 30_000,
  });
}

export function useBookingDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id ?? ''),
    queryFn: () => bookingsApi.getById(id!),
    enabled: !!id,
  });
}
