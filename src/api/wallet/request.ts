import { authRequest } from 'api/axios';
import { WalletGroupItem } from './types';

export const getWalletQuery = async (): Promise<WalletGroupItem> => {
  const { data } = await authRequest.post(`/bb/asset/show`);
  return data;
};
