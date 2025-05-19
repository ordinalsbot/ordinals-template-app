import { useQuery } from '@tanstack/react-query';

import { fetchMempoolTx } from '@/lib/api';
import { ONE_SECOND } from '@/lib/constants';

export const useMempoolTx = (txid?: string) => {
  return useQuery({
    queryKey: ['mempool', 'tx', txid],
    queryFn: () => fetchMempoolTx(txid!),
    refetchInterval: 20 * ONE_SECOND.toMillis(),
    retry: 10,
    enabled: !!txid,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000)
  });
};
