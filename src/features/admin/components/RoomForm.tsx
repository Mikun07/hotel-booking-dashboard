import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../../shared/ui/Input';
import Select from '../../../shared/ui/Select';
import Button from '../../../shared/ui/Button';
import { useCreateRoom } from '../hooks/useAdminRooms';
import type { CreateRoomRequest } from '../api/adminApi';

const schema = z.object({
  roomNumber: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  type: z.enum(['SINGLE', 'DOUBLE', 'SUITE', 'PENTHOUSE']),
  capacity: z.string().min(1, 'Required'),
  pricePerNight: z.string().min(1, 'Required'),
  floor: z.string().min(1, 'Required'),
  amenities: z.string(),
  images: z.string(),
});

type FormValues = z.infer<typeof schema>;

const roomTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
];

interface Props { onSuccess?: () => void; }

export default function RoomForm({ onSuccess }: Props) {
  const { mutate, isPending } = useCreateRoom();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = (data: FormValues) => {
    const payload: CreateRoomRequest = {
      ...data,
      capacity: Number(data.capacity),
      pricePerNight: Number(data.pricePerNight),
      floor: Number(data.floor),
      amenities: data.amenities.split(',').map(s => s.trim()).filter(Boolean),
      images: data.images.split(',').map(s => s.trim()).filter(Boolean),
    };
    mutate(payload, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input label="Room Number" error={errors.roomNumber?.message} {...register('roomNumber')} />
        <Input label="Name" error={errors.name?.message} {...register('name')} />
      </div>
      <Input label="Description" error={errors.description?.message} {...register('description')} />
      <div className="flex gap-3">
        <Select label="Type" options={roomTypeOptions} error={errors.type?.message} {...register('type')} />
        <Input label="Capacity" type="number" error={errors.capacity?.message} {...register('capacity')} min={1} />
      </div>
      <div className="flex gap-3">
        <Input label="Price / Night ($)" type="number" error={errors.pricePerNight?.message} {...register('pricePerNight')} min={1} />
        <Input label="Floor" type="number" error={errors.floor?.message} {...register('floor')} min={0} />
      </div>
      <Input label="Amenities (comma-separated)" placeholder="WiFi, TV, Pool" {...register('amenities')} />
      <Input label="Image URLs (comma-separated)" placeholder="https://..." {...register('images')} />
      <Button type="submit" loading={isPending}>Create Room</Button>
    </form>
  );
}
