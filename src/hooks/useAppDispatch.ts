import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@root/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
