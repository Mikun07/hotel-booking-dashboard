import type { RoomSummary } from './room.types';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED';

export interface BookingDetail {
  id: string;
  room: RoomSummary;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests: string | null;
  createdAt: string;
}

export interface CreateBookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  specialRequests?: string;
}

export interface ArrivalSummary {
  bookingId: string;
  bookingReference: string;
  guestName: string;
  roomNumber: string;
  roomName: string;
  guestsCount: number;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
}
