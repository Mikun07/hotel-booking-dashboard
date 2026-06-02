import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';
import type { Role } from '../shared/types/user.types';

interface Props { allowedRoles: Role[]; }

export default function RoleRoute({ allowedRoles }: Props) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
