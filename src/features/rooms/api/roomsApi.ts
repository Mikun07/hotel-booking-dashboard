import { apiClient } from '../../../services/api/client';
import type { RoomSummary, RoomDetail, SearchParams, RoomType } from '../../../shared/types/room.types';
import type { PaginatedResponse } from '../../../shared/types/api.types';

export const roomsApi = {
  list: (filters?: { roomType?: RoomType; minPrice?: number; maxPrice?: number }): Promise<PaginatedResponse<RoomSummary>> =>
    apiClient.get('/rooms', { params: filters }).then(r => r.data),

  search: (params: SearchParams): Promise<PaginatedResponse<RoomSummary>> =>
    apiClient.get('/rooms/search', { params }).then(r => r.data),

  getById: (id: string): Promise<RoomDetail> =>
    apiClient.get(`/rooms/${id}`).then(r => r.data),
};
