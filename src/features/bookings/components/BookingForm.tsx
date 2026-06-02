import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RoomDetail } from '../../../shared/types/room.types';
import type { BookingDetail } from '../../../shared/types/booking.types';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { nightsBetween } from '../../../shared/utils/formatDate';
import { useCreateBooking } from '../hooks/useCreateBooking';

const schema = z.object({
  checkInDate: z.string().min(1, 'Required'),
  checkOutDate: z.string().min(1, 'Required'),
  guestsCount: z.string().min(1, 'Required'),
  specialRequests: z.string().optional(),
}).refine(d => new Date(d.checkOutDate) > new Date(d.checkInDate), {
  message: 'Check-out must be after check-in',
  path: ['checkOutDate'],
});

type FormValues = z.infer<typeof schema>;

interface Props {
  room: RoomDetail;
  initialDates?: { checkIn: string; checkOut: string };
  onSuccess?: (booking: BookingDetail) => void;
}

export default function BookingForm({ room, initialDates }: Props) {
  const { mutate, isPending } = useCreateBooking();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { checkInDate: initialDates?.checkIn ?? '', checkOutDate: initialDates?.checkOut ?? '', guestsCount: '1' },
  });

  const checkIn = watch('checkInDate');
  const checkOut = watch('checkOutDate');
  const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn) ? nightsBetween(checkIn, checkOut) : 0;
  const total = nights * room.pricePerNight;

  const submit = (data: FormValues) => {
    mutate({ roomId: room.id, checkInDate: data.checkInDate, checkOutDate: data.checkOutDate, guestsCount: Number(data.guestsCount), specialRequests: data.specialRequests });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Input label="Check-in" type="date" error={errors.checkInDate?.message} {...register('checkInDate')} min={new Date().toISOString().slice(0, 10)} />
        <Input label="Check-out" type="date" error={errors.checkOutDate?.message} {...register('checkOutDate')} min={new Date().toISOString().slice(0, 10)} />
      </div>
      <Input label="Guests" type="number" error={errors.guestsCount?.message} {...register('guestsCount')} min={1} max={room.capacity} />
      <Input label="Special Requests (optional)" placeholder="e.g. early check-in, allergies..." {...register('specialRequests')} />
      {nights > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-1">
          <p className="text-sm text-gray-600">{nights} night{nights > 1 ? 's' : ''} × {formatCurrency(room.pricePerNight)}</p>
          <p className="font-bold text-blue-950 text-lg">Total: {formatCurrency(total)}</p>
        </div>
      )}
      <Button type="submit" loading={isPending} size="lg">Confirm Booking</Button>
    </form>
  );
}
