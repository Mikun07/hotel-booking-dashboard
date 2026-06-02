import { apiClient } from '../../../services/api/client';
import type { BookingDetail, ArrivalSummary, BookingStatus } from '../../../shared/types/booking.types';
import type { PaginatedResponse } from '../../../shared/types/api.types';

export const staffApi = {
  getTodaysArrivals: (): Promise<PaginatedResponse<ArrivalSummary>> =>
    apiClient.get('/staff/arrivals/today').then(r => r.data),

  checkIn: (bookingId: string): Promise<BookingDetail> =>
    apiClient.patch(`/staff/bookings/${bookingId}/check-in`).then(r => r.data),

  checkOut: (bookingId: string): Promise<BookingDetail> =>
    apiClient.patch(`/staff/bookings/${bookingId}/check-out`).then(r => r.data),

  getAllBookings: (params?: { status?: BookingStatus; skip?: number; limit?: number }): Promise<PaginatedResponse<BookingDetail>> =>
    apiClient.get('/staff/bookings', { params }).then(r => r.data),
};
