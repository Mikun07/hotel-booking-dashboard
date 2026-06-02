import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../api/roomsApi';
import { queryKeys } from '../../../services/queryKeys';
import type { SearchParams } from '../../../shared/types/room.types';

export function useRoomSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: queryKeys.rooms.search(params),
    queryFn: () => roomsApi.search(params!),
    enabled: params !== null,
    staleTime: 30_000,
  });
}

export function useRoomList(filters?: object) {
  return useQuery({
    queryKey: queryKeys.rooms.list(filters),
    queryFn: () => roomsApi.list(filters),
    staleTime: 60_000,
  });
}
