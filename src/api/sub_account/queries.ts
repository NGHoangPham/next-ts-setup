import { TListSubAccount } from './types';
import { useQuery } from 'react-query';
import { authRequest } from 'api/axios';

export const useListSubAccount = () => {
  return useQuery<TListSubAccount>('/subAccount/getSubAccounts', async () => {
    const { data } = await authRequest.post(`/subAccount/getSubAccounts`);
    return data;
  });
};
