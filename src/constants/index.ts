// App constants
export const APP_NAME = 'FE Base Project';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRES_AT: 'token_expires_at',
  USER: 'user',
  THEME: 'theme',
  BE_USER: 'be_user',
} as const;

export const AUTH_REFRESH_POLICY = {
  REFRESH_BEFORE_EXPIRY_MS: 2 * 60 * 1000,
  MAX_RETRIES: 3,
  BASE_DELAY_MS: 500,
  MAX_DELAY_MS: 30 * 1000,
  JITTER_MS: 250,
} as const;
