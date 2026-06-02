import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api/bookingsApi';
import { queryKeys } from '../../../services/queryKeys';
import { showToast } from '../../../store/uiSlice';
import { useAppDispatch } from '../../../store/hooks';

export function useCreateBooking() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: booking => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.all });
      qc.invalidateQueries({ queryKey: queryKeys.rooms.all });
      dispatch(showToast({ message: 'Booking confirmed!', type: 'success' }));
      navigate(`/bookings/${booking.id}/confirmation`);
    },
    onError: () => {
      dispatch(showToast({ message: 'Room no longer available for selected dates.', type: 'error' }));
    },
  });
}
