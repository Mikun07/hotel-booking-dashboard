import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../api/roomsApi';
import { queryKeys } from '../../../services/queryKeys';

export function useRoomDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id ?? ''),
    queryFn: () => roomsApi.getById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}
