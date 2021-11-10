import { request } from './../axios';
import { useQuery, UseQueryOptions } from 'react-query';

export const useGetCreditFiats = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>(
    'get/credit/fiats',
    async () => {
      const { data } = await request.post('/get/credit/fiats');
      return data;
    },
    options
  );
};

export const useGetCreditCoins = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>(
    'get/credit/coins',
    async () => {
      const { data } = await request.post('/get/credit/coins');
      return data;
    },
    options
  );
};
