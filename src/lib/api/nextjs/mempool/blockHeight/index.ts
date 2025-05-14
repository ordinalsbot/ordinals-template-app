import apiClient from '@/lib/utilities/apiClient';

export const fetchBlockHeight = async () => {
  const response = await apiClient.get<number>('api/block-height', { baseUrl: '/' });

  return response.data;
};
