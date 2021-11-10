import { MarketGroupItem } from './types';
import { request } from 'api/axios';

export const getMarketQuery = async (): Promise<MarketGroupItem[]> => {
  const { data } = await request.post('/bb/symbol/market/group');
  return data.bbMarketList;
};
