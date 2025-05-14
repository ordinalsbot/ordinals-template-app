import { useQuery } from '@tanstack/react-query';

import { fetchBlockHeight } from '@/lib/api';
import { ONE_MINUTE } from '@/lib/constants';

export const useBlockHeight = () => {
  return useQuery({
    queryKey: ['blockHeight'],
    queryFn: fetchBlockHeight,
    select: (data) => data ?? 0,
    refetchInterval: ONE_MINUTE.milliseconds * 2
  });
};
