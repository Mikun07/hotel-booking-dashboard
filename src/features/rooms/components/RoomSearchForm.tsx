import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import type { SearchParams } from '../../../shared/types/room.types';

const schema = z.object({
  checkIn: z.string().min(1, 'Check-in required'),
  checkOut: z.string().min(1, 'Check-out required'),
  guests: z.string().min(1, 'At least 1 guest'),
}).refine(d => new Date(d.checkOut) > new Date(d.checkIn), {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],
});

type FormValues = z.infer<typeof schema>;

interface RoomSearchFormProps {
  defaultValues?: Partial<SearchParams>;
  onSearch?: (params: SearchParams) => void;
}

export default function RoomSearchForm({ defaultValues, onSearch }: RoomSearchFormProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guests: String(defaultValues?.guests ?? 1), checkIn: defaultValues?.checkIn ?? '', checkOut: defaultValues?.checkOut ?? '' },
  });

  const submit = (data: FormValues) => {
    const params: SearchParams = { checkIn: data.checkIn, checkOut: data.checkOut, guests: Number(data.guests) };
    if (onSearch) {
      onSearch(params);
    } else {
      navigate(`/rooms/search?checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-3 items-end w-full">
      <Input
        label="Check-in"
        type="date"
        error={errors.checkIn?.message}
        {...register('checkIn')}
        min={new Date().toISOString().slice(0, 10)}
      />
      <Input
        label="Check-out"
        type="date"
        error={errors.checkOut?.message}
        {...register('checkOut')}
        min={new Date().toISOString().slice(0, 10)}
      />
      <Input
        label="Guests"
        type="number"
        error={errors.guests?.message}
        {...register('guests')}
        min={1}
        max={10}
      />
      <Button type="submit" size="lg" className="whitespace-nowrap lg:mb-0">Search Rooms</Button>
    </form>
  );
}
