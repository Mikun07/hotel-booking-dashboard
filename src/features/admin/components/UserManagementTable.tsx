import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { queryKeys } from '../../../services/queryKeys';
import type { UserSummary, Role } from '../../../shared/types/user.types';
import Button from '../../../shared/ui/Button';
import Spinner from '../../../shared/ui/Spinner';
import { showToast } from '../../../store/uiSlice';
import { useAppDispatch } from '../../../store/hooks';

export default function UserManagementTable() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => adminApi.getAllUsers(),
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => adminApi.changeUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.users() }); dispatch(showToast({ message: 'Role updated.', type: 'success' })); },
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.users() }); dispatch(showToast({ message: 'User deactivated.', type: 'info' })); },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  const users: UserSummary[] = data?.items ?? [];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Name</th>
            <th className="text-left px-4 py-3 font-medium">Email</th>
            <th className="text-left px-4 py-3 font-medium">Role</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
              <td className="px-4 py-3 text-gray-500">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role.toLowerCase()}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                {u.role === 'GUEST' && (
                  <Button size="sm" variant="secondary" onClick={() => changeRole.mutate({ id: u.id, role: 'STAFF' })}>→ Staff</Button>
                )}
                {u.role === 'STAFF' && (
                  <Button size="sm" variant="ghost" onClick={() => changeRole.mutate({ id: u.id, role: 'GUEST' })}>→ Guest</Button>
                )}
                {u.isActive && (
                  <Button size="sm" variant="danger" onClick={() => deactivate.mutate(u.id)}>Deactivate</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
