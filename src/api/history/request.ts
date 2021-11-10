import { authRequest } from 'api/axios';
import { TRequestHistory, TSuccessResponse, TCancelOrder, TCancelAllOrder } from './types';

export const searchOrderHistory = async (request: TRequestHistory): Promise<TSuccessResponse> => {
  const { data } = await authRequest.post(`/bb/market/order/order/history`, request);
  return data;
};

export const searchTradeHistory = async (request: TRequestHistory): Promise<TSuccessResponse> => {
  const { data } = await authRequest.post(`/bb/market/order/trade/history`, request);
  return data;
};

export const cancelOrder = async (request: TCancelOrder) => {
  await authRequest.post(`/bb/market/order/cancel-order`, request);
  return;
};

export const cancelAllOrder = async (request: TCancelAllOrder) => {
  await authRequest.post(`/bb/market/order/cancel-all-order`, request);
  return;
};
