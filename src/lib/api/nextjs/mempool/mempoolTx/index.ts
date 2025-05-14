import apiClient from '@/lib/utilities/apiClient';
import { TMempoolTx } from '@/types';

export const fetchMempoolTx = async (txid: string) => {
  const response = await apiClient.get<TMempoolTx>(`api/mempool/tx/${txid}`, {
    baseUrl: '/'
  });

  return response.data!;
};
