import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staffApi';
import { queryKeys } from '../../../services/queryKeys';
import { showToast } from '../../../store/uiSlice';
import { useAppDispatch } from '../../../store/hooks';

export function useTodaysArrivals() {
  return useQuery({
    queryKey: queryKeys.staff.arrivals,
    queryFn: staffApi.getTodaysArrivals,
    staleTime: 60_000,
  });
}

export function useCheckIn() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (bookingId: string) => staffApi.checkIn(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staff.arrivals });
      qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      dispatch(showToast({ message: 'Check-in processed.', type: 'success' }));
    },
    onError: () => dispatch(showToast({ message: 'Check-in failed.', type: 'error' })),
  });
}

export function useCheckOut() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (bookingId: string) => staffApi.checkOut(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      dispatch(showToast({ message: 'Check-out processed.', type: 'success' }));
    },
    onError: () => dispatch(showToast({ message: 'Check-out failed.', type: 'error' })),
  });
}
