import React, { useState } from 'react';
import DashboardStats from '../features/admin/components/DashboardStats';
import { useDashboardStats } from '../features/admin/hooks/useAdminReports';
import UserManagementTable from '../features/admin/components/UserManagementTable';
import RoomForm from '../features/admin/components/RoomForm';
import Modal from '../shared/ui/Modal';
import Button from '../shared/ui/Button';
import { useRoomList } from '../features/rooms/hooks/useRoomSearch';
import { useDeactivateRoom } from '../features/admin/hooks/useAdminRooms';
import Spinner from '../shared/ui/Spinner';
import { formatCurrency } from '../shared/utils/formatCurrency';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'overview' | 'rooms' | 'users'>('overview');
  const [roomFormOpen, setRoomFormOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: roomsData, isLoading: roomsLoading } = useRoomList();
  const { mutate: deactivate } = useDeactivateRoom();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'users', label: 'Users' },
  ] as const;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-blue-950">Admin Dashboard</h1>
        {tab === 'rooms' && (
          <Button onClick={() => setRoomFormOpen(true)}>+ Add Room</Button>
        )}
      </div>

      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-blue-950 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <DashboardStats stats={stats} isLoading={statsLoading} />}

      {tab === 'rooms' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          {roomsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Room</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Capacity</th>
                  <th className="text-left px-4 py-3 font-medium">Price/Night</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(roomsData?.items ?? []).map(room => (
                  <tr key={room.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-950">{room.name}</td>
                    <td className="px-4 py-3 capitalize">{room.type.toLowerCase()}</td>
                    <td className="px-4 py-3">{room.capacity}</td>
                    <td className="px-4 py-3">{formatCurrency(room.pricePerNight)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="danger" onClick={() => deactivate(room.id)}>Deactivate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'users' && <UserManagementTable />}

      <Modal isOpen={roomFormOpen} onClose={() => setRoomFormOpen(false)} title="Add New Room">
        <RoomForm onSuccess={() => setRoomFormOpen(false)} />
      </Modal>
    </div>
  );
}
