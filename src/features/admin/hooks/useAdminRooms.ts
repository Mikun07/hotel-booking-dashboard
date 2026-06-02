import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type CreateRoomRequest } from '../api/adminApi';
import { queryKeys } from '../../../services/queryKeys';
import { showToast } from '../../../store/uiSlice';
import { useAppDispatch } from '../../../store/hooks';

export function useAdminRooms() {
  return useQuery({
    queryKey: queryKeys.admin.rooms(),
    queryFn: () => adminApi.getAllBookings({ limit: 100 }),
    staleTime: 30_000,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: CreateRoomRequest) => adminApi.createRoom(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.rooms.all });
      qc.invalidateQueries({ queryKey: queryKeys.admin.rooms() });
      dispatch(showToast({ message: 'Room created.', type: 'success' }));
    },
    onError: () => dispatch(showToast({ message: 'Failed to create room.', type: 'error' })),
  });
}

export function useDeactivateRoom() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateRoom(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.rooms.all });
      dispatch(showToast({ message: 'Room deactivated.', type: 'info' }));
    },
  });
}
