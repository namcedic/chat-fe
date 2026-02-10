import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_ENDPOINTS, AUTH_REFRESH_POLICY, STORAGE_KEYS } from '@root/constants';

type RefreshResponse = {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
  expiresIn?: number;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const calcBackoffDelayMs = (attemptIndex: number) => {
  const exp = AUTH_REFRESH_POLICY.BASE_DELAY_MS * 2 ** attemptIndex;
  const capped = Math.min(exp, AUTH_REFRESH_POLICY.MAX_DELAY_MS);
  const jitter = Math.floor(Math.random() * AUTH_REFRESH_POLICY.JITTER_MS);
  return capped + jitter;
};

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

const getExpiresAt = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const setAuthTokens = (payload: RefreshResponse) => {
  if (typeof window === 'undefined') return;

  const accessToken = payload.accessToken ?? payload.token;
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
  }

  if (payload.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
  }

  if (typeof payload.expiresAt === 'number') {
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(payload.expiresAt));
  } else if (typeof payload.expiresIn === 'number') {
    localStorage.setItem(
      STORAGE_KEYS.TOKEN_EXPIRES_AT,
      String(Date.now() + payload.expiresIn * 1000)
    );
  }
};

const clearAuthAndRedirect = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  window.location.href = '/login';
};

let refreshInFlight: Promise<string | null> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleProactiveRefresh = () => {
  if (typeof window === 'undefined') return;

  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const expiresAt = getExpiresAt();
  if (!expiresAt) return;

  const msUntilRefresh = Math.max(
    0,
    expiresAt - Date.now() - AUTH_REFRESH_POLICY.REFRESH_BEFORE_EXPIRY_MS
  );

  refreshTimer = setTimeout(() => {
    void refreshTokenWithRetry();
  }, msUntilRefresh);
};

const refreshTokenWithRetry = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const rt = getRefreshToken();
    if (!rt) {
      clearAuthAndRedirect();
      return null;
    }

    for (let attempt = 0; attempt < AUTH_REFRESH_POLICY.MAX_RETRIES; attempt++) {
      try {
        const res = await axiosInstance.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH, {
          refreshToken: rt,
        });

        setAuthTokens(res.data);
        scheduleProactiveRefresh();

        return getAccessToken();
      } catch {
        const isLast = attempt === AUTH_REFRESH_POLICY.MAX_RETRIES - 1;
        if (isLast) break;
        await sleep(calcBackoffDelayMs(attempt));
      }
    }

    clearAuthAndRedirect();
    return null;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

const shouldProactivelyRefresh = () => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return false;
  return expiresAt - Date.now() <= AUTH_REFRESH_POLICY.REFRESH_BEFORE_EXPIRY_MS;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      if (shouldProactivelyRefresh() && !config.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        await refreshTokenWithRetry();
      }

      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalConfig = error.config as InternalAxiosRequestConfig | undefined;

    if (
      status === 401 &&
      originalConfig &&
      !originalConfig.url?.includes(API_ENDPOINTS.AUTH.REFRESH) &&
      !(originalConfig as InternalAxiosRequestConfig & { _retry?: boolean })._retry
    ) {
      (originalConfig as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;

      const newToken = await refreshTokenWithRetry();
      if (newToken) {
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalConfig);
      }
    }

    if (status === 401) {
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);

if (typeof window !== 'undefined') {
  scheduleProactiveRefresh();
}

export default axiosInstance;
