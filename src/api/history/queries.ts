import { request } from 'api/axios';
import { useQuery } from 'react-query';

export function usePairAllQuery(options?: any) {
  return useQuery(
    '/bb/symbol/all',
    async () => {
      const { data } = await request.post(`/bb/symbol/all`);
      return data;
    },
    options
  );
}
