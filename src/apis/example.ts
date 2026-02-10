import type { ApiResponse } from '@root/types';
import axios from '@root/utils/axios';

// Example API functions
export const exampleApi = {
  getData: async (): Promise<ApiResponse> => {
    const response = await axios.get('/example');
    return response.data;
  },

  postData: async (data: unknown): Promise<ApiResponse> => {
    const response = await axios.post('/example', data);
    return response.data;
  },
};
