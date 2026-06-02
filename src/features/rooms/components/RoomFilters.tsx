import React from 'react';
import Select from '../../../shared/ui/Select';
import Input from '../../../shared/ui/Input';
import type { RoomType } from '../../../shared/types/room.types';

interface RoomFiltersProps {
  roomType?: RoomType;
  minPrice?: number;
  maxPrice?: number;
  onChange: (filters: { roomType?: RoomType; minPrice?: number; maxPrice?: number }) => void;
}

const roomTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
];

export default function RoomFilters({ roomType, minPrice, maxPrice, onChange }: RoomFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-blue-950">Filters</h3>
      <Select
        label="Room Type"
        options={roomTypeOptions}
        placeholder="All types"
        value={roomType ?? ''}
        onChange={e => onChange({ roomType: (e.target.value as RoomType) || undefined, minPrice, maxPrice })}
      />
      <Input
        label="Min Price ($/night)"
        type="number"
        value={minPrice ?? ''}
        min={0}
        onChange={e => onChange({ roomType, minPrice: e.target.value ? Number(e.target.value) : undefined, maxPrice })}
      />
      <Input
        label="Max Price ($/night)"
        type="number"
        value={maxPrice ?? ''}
        min={0}
        onChange={e => onChange({ roomType, minPrice, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
      />
    </div>
  );
}
