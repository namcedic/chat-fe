import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, AuthResponse, AuthTokens } from './types';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateFromStorage: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    applyTokensFromStorage: (state, action: PayloadAction<AuthTokens | null>) => {
      state.isLoading = false;
      if (!action.payload) {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        return;
      }
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginRequest: (state, _action: PayloadAction<{ username: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user || null;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    registerRequest: (
      state,
      _action: PayloadAction<{ email: string; password: string; name?: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user || null;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    refreshTokenRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const {
  hydrateFromStorage,
  applyTokensFromStorage,
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
  clearError,
  setSession,
} = authSlice.actions;

export default authSlice.reducer;
