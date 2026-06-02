import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setCredentials } from '../../../store/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import type { UserProfile } from '../../../shared/types/user.types';

export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Fetch full profile after login
      let user: UserProfile;
      try {
        // Temporarily set token so the profile request is authenticated
        dispatch(setCredentials({ user: {} as UserProfile, accessToken: data.access_token }));
        user = await authApi.getProfile();
      } catch {
        user = {} as UserProfile;
      }
      dispatch(setCredentials({ user, accessToken: data.access_token }));
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'STAFF') navigate('/staff');
      else navigate('/dashboard');
    },
  });
}
