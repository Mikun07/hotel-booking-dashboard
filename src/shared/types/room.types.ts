export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'PENTHOUSE';
export type RoomStatus = 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';

export interface RoomSummary {
  id: string;
  roomNumber: string;
  name: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  primaryImage: string;
  amenities: string[];
}

export interface RoomDetail extends RoomSummary {
  description: string;
  floor: number;
  images: string[];
  status: RoomStatus;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: RoomType;
  minPrice?: number;
  maxPrice?: number;
}
