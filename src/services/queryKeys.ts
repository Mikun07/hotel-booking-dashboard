import type { SearchParams } from '../shared/types/room.types';

export const queryKeys = {
  rooms: {
    all: ['rooms'] as const,
    list: (filters?: object) => ['rooms', 'list', filters] as const,
    search: (params: SearchParams | null) => ['rooms', 'search', params] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (params?: object) => ['bookings', 'list', params] as const,
    detail: (id: string) => ['bookings', id] as const,
  },
  staff: {
    arrivals: ['staff', 'arrivals'] as const,
    allBookings: (params?: object) => ['staff', 'bookings', params] as const,
  },
  admin: {
    rooms: (params?: object) => ['admin', 'rooms', params] as const,
    users: (params?: object) => ['admin', 'users', params] as const,
    dashboard: ['admin', 'dashboard'] as const,
    revenue: (params?: object) => ['admin', 'revenue', params] as const,
  },
};
