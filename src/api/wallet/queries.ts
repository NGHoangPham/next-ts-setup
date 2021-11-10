import { authRequest } from 'api/axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { WalletGroupItem } from './types';

export function useWalletQuery(options?: UseQueryOptions<WalletGroupItem>) {
  return useQuery<WalletGroupItem>(
    '/bb/asset/show',
    async () => {
      const { data } = await authRequest.post('/bb/asset/show');
      return data;
    },
    options
  );
}
