import React from 'react';
import Badge from '../../../shared/ui/Badge';
import type { BookingStatus } from '../../../shared/types/booking.types';

interface Props { status: BookingStatus; size?: 'sm' | 'md'; }

export default function BookingStatusBadge({ status, size }: Props) {
  return <Badge status={status} size={size} />;
}
