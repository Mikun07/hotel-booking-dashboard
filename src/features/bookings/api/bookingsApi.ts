import { apiClient } from '../../../services/api/client';
import type { BookingDetail, CreateBookingRequest } from '../../../shared/types/booking.types';
import type { PaginatedResponse } from '../../../shared/types/api.types';

export const bookingsApi = {
  create: (data: CreateBookingRequest): Promise<BookingDetail> =>
    apiClient.post('/bookings', data).then(r => r.data),

  list: (params?: { skip?: number; limit?: number }): Promise<PaginatedResponse<BookingDetail>> =>
    apiClient.get('/bookings', { params }).then(r => r.data),

  getById: (id: string): Promise<BookingDetail> =>
    apiClient.get(`/bookings/${id}`).then(r => r.data),

  cancel: (id: string): Promise<BookingDetail> =>
    apiClient.patch(`/bookings/${id}/cancel`).then(r => r.data),

  updateSpecialRequests: (id: string, specialRequests: string): Promise<BookingDetail> =>
    apiClient.patch(`/bookings/${id}/special-requests`, { special_requests: specialRequests }).then(r => r.data),
};
