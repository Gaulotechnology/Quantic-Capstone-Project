import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshRequest,
  RefreshResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  User,
} from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await apiClient.post('/api/auth/refresh', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ detail: string }> => {
    const response = await apiClient.post('/api/auth/password-reset/request', data);
    return response.data;
  },

  resetPassword: async (data: PasswordResetConfirm): Promise<{ detail: string }> => {
    const response = await apiClient.post('/api/auth/password-reset/reset', data);
    return response.data;
  },
};
