import { STORAGE_KEYS } from '@root/constants';
import type { AuthTokens } from '@root/store/auth/types';

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function parseJwtExpMs(token: string): number | undefined {
  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return undefined;
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    if (!payload?.exp) return undefined;
    return payload.exp * 1000;
  } catch {
    return undefined;
  }
}

export function getAuthTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  return safeJsonParse<AuthTokens>(localStorage.getItem(STORAGE_KEYS.BE_USER));
}

export function setAuthTokens(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;
  const accessTokenExp = tokens.accessTokenExp ?? parseJwtExpMs(tokens.accessToken);
  const toSave: AuthTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenExp,
  };
  localStorage.setItem(STORAGE_KEYS.BE_USER, JSON.stringify(toSave));
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.BE_USER);
}

export function isTokenExpired(expMs?: number, skewMs = 0): boolean {
  if (!expMs) return true;
  return Date.now() + skewMs >= expMs;
}
