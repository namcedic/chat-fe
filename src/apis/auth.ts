import type {
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  AuthResponse,
} from '@root/store/auth/types';
import type { ApiResponse } from '@root/types';
import axios from '@root/utils/axios';

const beBaseUrl = process.env.NEXT_PUBLIC_BE_DOMAIN || `http://localhost:3001/api/be`;

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axios.post(`${beBaseUrl}/v1/auth/login`, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axios.post(`${beBaseUrl}/v1/auth/register`, data);
    return response.data;
  },

  refreshToken: async (data: RefreshRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axios.post(`${beBaseUrl}/v1/auth/refresh`, data);
    return response.data;
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await axios.post(`${beBaseUrl}/v1/auth/change-password`, data);
    return response.data;
  },

  getSession: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    const response = await axios.get(`${beBaseUrl}/v1/auth/session`);
    return response.data;
  },
};
