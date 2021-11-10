import { TGetDigitalFiat, TGetDigitalCoin, TLimitFiat } from './types';
import { authRequest } from 'api/axios';

export const getDigitalCoin = async (params: TGetDigitalCoin) => {
  const { data } = await authRequest.post('/payment/buy-price', params);
  return data;
};

export const getFiatCurrency = async (params: TGetDigitalFiat) => {
  const { data } = await authRequest.post('/payment/sell-price', params);
  return data;
};

export const getLimitFiat = async (params: TLimitFiat) => {
  const { data } = await authRequest.post('/credit/limit', params);
  return data;
};
