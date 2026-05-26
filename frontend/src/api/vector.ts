import apiClient from './client';
import type { SearchRequest, SearchResponse } from '../types';

export const vectorApi = {
  search: async (data: SearchRequest): Promise<SearchResponse> => {
    const response = await apiClient.post('/api/vectors/search', data);
    return response.data;
  },
};
