import type { Task } from 'redux-saga';
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
  race,
  take,
} from 'redux-saga/effects';

import { authApi } from '@root/apis/auth';
import type { RootState } from '@root/store';
import {
  clearAuthTokens,
  getAuthTokens,
  isTokenExpired,
  setAuthTokens,
} from '@root/utils/tokenStorage';

import {
  applyTokensFromStorage,
  hydrateFromStorage,
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} from './authSlice';

let refreshTask: Task | null = null;

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const { username, password } = action.payload;
    const response: Awaited<ReturnType<typeof authApi.login>> = yield call(authApi.login, {
      username,
      password,
    });
    yield put(loginSuccess(response.data));
    setAuthTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    yield put(loginFailure(errorMessage));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const { email, password, name } = action.payload;
    const response: Awaited<ReturnType<typeof authApi.register>> = yield call(authApi.register, {
      email,
      password,
      name,
    });
    yield put(registerSuccess(response.data));
    setAuthTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Register failed';
    yield put(registerFailure(errorMessage));
  }
}

function* handleRefreshToken() {
  try {
    const tokens = getAuthTokens();
    const refreshToken = tokens?.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    const response: Awaited<ReturnType<typeof authApi.refreshToken>> = yield call(
      authApi.refreshToken,
      {
        refreshToken,
      }
    );
    yield put(refreshTokenSuccess(response.data));
    setAuthTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Refresh token failed';
    yield put(refreshTokenFailure(errorMessage));
    clearAuthTokens();
  }
}

function* handleHydrateFromStorage() {
  const tokens = getAuthTokens();
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    yield put(applyTokensFromStorage(null));
    return;
  }
  // If already expired (or no exp), we'll let refresh saga handle later; treat as logged-in if accessToken exists
  if (tokens.accessTokenExp && isTokenExpired(tokens.accessTokenExp)) {
    // try refresh immediately
    yield put(applyTokensFromStorage(tokens));
    yield put(refreshTokenRequest());
    return;
  }
  yield put(applyTokensFromStorage(tokens));
}

const REFRESH_BEFORE_EXP_MS = 120_000; // 2 minutes
const REFRESH_MAX_ATTEMPTS = 3;

function* scheduleAutoRefresh() {
  const state: RootState = yield select((s: RootState) => s);
  const accessToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;
  if (!accessToken || !refreshToken) return;

  const tokens = getAuthTokens();
  const expMs = tokens?.accessTokenExp;
  if (!expMs) return;

  // Wait until `REFRESH_BEFORE_EXP_MS` before the access token expires (minimum 5s)
  const msUntilRefresh = Math.max(expMs - Date.now() - REFRESH_BEFORE_EXP_MS, 5_000);
  if (msUntilRefresh > 0) {
    yield delay(msUntilRefresh);
  }

  // Try to refresh up to REFRESH_MAX_ATTEMPTS times with incremental back-off
  for (let attempt = 0; attempt < REFRESH_MAX_ATTEMPTS; attempt += 1) {
    yield put(refreshTokenRequest());

    // Wait for either success or failure of this refresh attempt
    const { success } = yield race({
      success: take(refreshTokenSuccess.type),
      failure: take(refreshTokenFailure.type),
    });

    if (success) {
      // On success, the token-updated handler will cancel this task & schedule a new one
      return;
    }

    // If failed and we still have attempts left, wait longer than the previous attempt
    if (attempt < REFRESH_MAX_ATTEMPTS - 1) {
      // Simple incremental back-off: wait (attempt + 1) * 30s → 30s, 60s
      const waitMs = (attempt + 1) * 30_000;
      yield delay(waitMs);
    }
  }
}

function* handleTokensUpdated() {
  if (refreshTask) {
    yield cancel(refreshTask);
    refreshTask = null;
  }
  refreshTask = yield fork(scheduleAutoRefresh);
}

export default function* authSaga() {
  yield takeEvery(hydrateFromStorage.type, handleHydrateFromStorage);
  yield takeEvery(loginRequest.type, handleLogin);
  yield takeEvery(registerRequest.type, handleRegister);
  yield takeEvery(refreshTokenRequest.type, handleRefreshToken);

  yield takeLatest(loginSuccess.type, handleTokensUpdated);
  yield takeLatest(refreshTokenSuccess.type, handleTokensUpdated);
}
