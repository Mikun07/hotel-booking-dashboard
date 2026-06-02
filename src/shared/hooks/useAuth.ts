import { useAppSelector } from '../../store/hooks';

export function useAuth() {
  const user = useAppSelector(s => s.auth.user);
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  const isLoading = useAppSelector(s => s.auth.isLoading);
  return { user, isAuthenticated, isLoading };
}
