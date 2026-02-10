'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { store } from '@root/store';
import { hydrateFromStorage } from '@root/store/auth/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
