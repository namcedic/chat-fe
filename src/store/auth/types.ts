export interface LoginRequest {
  username: string; // phone | email | username
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExp?: number; // epoch ms
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: number;
    email: string;
    name?: string;
  } | null;
}
