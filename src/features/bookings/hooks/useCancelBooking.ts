import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { queryKeys } from '../../../services/queryKeys';
import { showToast } from '../../../store/uiSlice';
import { useAppDispatch } from '../../../store/hooks';

export function useCancelBooking() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: (booking) => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      qc.setQueryData(queryKeys.bookings.detail(booking.id), booking);
      dispatch(showToast({ message: 'Booking cancelled.', type: 'info' }));
    },
    onError: () => {
      dispatch(showToast({ message: 'Could not cancel booking.', type: 'error' }));
    },
  });
}
