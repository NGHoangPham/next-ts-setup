import { useQuery, UseQueryOptions } from 'react-query';
import { authRequest } from 'api/axios';
import { CurrencyGroupItemResponse } from './types';
import { TGetUserInfoRequest, TGetUserInfoResponse } from '.';

export const useCurrencyGroupItem = () => {
  return useQuery<CurrencyGroupItemResponse[]>('index/currency', async () => {
    const { data } = await authRequest.post(`/index/currency`);
    return data;
  });
};

export const useGetUserInfo = (params: TGetUserInfoRequest, options?: UseQueryOptions<TGetUserInfoResponse>) => {
  return useQuery<TGetUserInfoResponse>(
    'skipid/user/info',
    async () => {
      const { data } = await authRequest.post(`/skipid/user/info`, params);
      return data;
    },
    options
  );
};
