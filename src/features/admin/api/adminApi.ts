import { apiClient } from '../../../services/api/client';
import type { RoomDetail, RoomType } from '../../../shared/types/room.types';
import type { BookingDetail, BookingStatus } from '../../../shared/types/booking.types';
import type { UserSummary, Role } from '../../../shared/types/user.types';
import type { PaginatedResponse } from '../../../shared/types/api.types';

export interface DashboardStats {
  totalBookingsToday: number;
  totalActiveBookings: number;
  occupancyRate: number;
  revenueThisMonth: number;
}

export interface CreateRoomRequest {
  roomNumber: string;
  name: string;
  description: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  floor: number;
  amenities: string[];
  images: string[];
}

export const adminApi = {
  getDashboardStats: (): Promise<DashboardStats> =>
    apiClient.get('/admin/reports/dashboard').then(r => r.data),

  getRevenue: (params: { startDate: string; endDate: string }): Promise<{ date: string; revenue: number }[]> =>
    apiClient.get('/admin/reports/revenue', { params }).then(r => r.data),

  createRoom: (data: CreateRoomRequest): Promise<RoomDetail> =>
    apiClient.post('/admin/rooms', data).then(r => r.data),

  updateRoom: (id: string, data: Partial<CreateRoomRequest>): Promise<RoomDetail> =>
    apiClient.put(`/admin/rooms/${id}`, data).then(r => r.data),

  deactivateRoom: (id: string): Promise<RoomDetail> =>
    apiClient.patch(`/admin/rooms/${id}/deactivate`).then(r => r.data),

  setRoomMaintenance: (id: string): Promise<RoomDetail> =>
    apiClient.patch(`/admin/rooms/${id}/maintenance`).then(r => r.data),

  getAllBookings: (params?: { status?: BookingStatus; skip?: number; limit?: number }): Promise<PaginatedResponse<BookingDetail>> =>
    apiClient.get('/admin/bookings', { params }).then(r => r.data),

  getAllUsers: (params?: { skip?: number; limit?: number }): Promise<PaginatedResponse<UserSummary>> =>
    apiClient.get('/admin/users', { params }).then(r => r.data),

  changeUserRole: (userId: string, role: Role): Promise<UserSummary> =>
    apiClient.patch(`/admin/users/${userId}/role`, { role }).then(r => r.data),

  deactivateUser: (userId: string): Promise<UserSummary> =>
    apiClient.patch(`/admin/users/${userId}/deactivate`).then(r => r.data),
};
