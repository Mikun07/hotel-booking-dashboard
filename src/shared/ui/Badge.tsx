import React from 'react';
import type { BookingStatus } from '../types/booking.types';

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  CHECKED_IN: 'bg-green-100 text-green-800',
  CHECKED_OUT: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

interface BadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium capitalize ${statusStyles[status]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      {status.replace('_', ' ').toLowerCase()}
    </span>
  );
}
