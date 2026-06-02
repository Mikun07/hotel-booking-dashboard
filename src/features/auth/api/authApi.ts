import { apiClient } from '../../../services/api/client';
import type { UserProfile } from '../../../shared/types/user.types';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { firstName: string; lastName: string; email: string; password: string; }
export interface AuthResponse { access_token: string; refresh_token: string; token_type: string; expires_in: number; }

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then(r => r.data),

  register: (data: RegisterRequest): Promise<UserProfile> =>
    apiClient.post('/auth/register', data).then(r => r.data),

  logout: (refreshToken: string): Promise<void> =>
    apiClient.post('/auth/logout', { refresh_token: refreshToken }).then(() => undefined),

  refresh: (): Promise<{ access_token: string }> =>
    apiClient.post('/auth/refresh', {}).then(r => r.data),

  getProfile: (): Promise<UserProfile> =>
    apiClient.get('/users/me').then(r => r.data),

  updateProfile: (data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone'>>): Promise<UserProfile> =>
    apiClient.patch('/users/me', data).then(r => r.data),
};
