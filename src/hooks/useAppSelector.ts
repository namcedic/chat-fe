import { useSelector } from 'react-redux';

import type { RootState } from '@root/store';

export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return useSelector(selector);
};
