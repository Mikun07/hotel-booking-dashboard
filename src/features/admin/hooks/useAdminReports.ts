import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { queryKeys } from '../../../services/queryKeys';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: adminApi.getDashboardStats,
    staleTime: 60_000,
  });
}
