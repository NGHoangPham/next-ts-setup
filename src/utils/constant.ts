/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const __prod__ = process.env.NODE_ENV === 'production';
export const SKIP_ID_URI = process.env.NEXT_PUBLIC_SKIPID_URI!;
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ultorex.org';
export const isServer = () => typeof window === 'undefined';

export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
export const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL!;

export const USER_COOKIES = {
  language: 'i18nextLng',
  currentCurrency: 'current-currency',
  auth0Cache: `@@auth0spajs@@::${AUTH0_CLIENT_ID}::https://skipid.net::openid profile email`,
  currentPair: 'currentPair',
  watchPairs: 'watchPairs',
  subAccount: 'subaccount',
};

export const initialCurrentCurrency = {
  coinType: 'USD',
  rate: '1',
  symbol: '$',
};

export const LANGUAGE = ['en', 'tr'];
export const DEFAULT_CURRENCY = 'USD';
export const ORDER_CANCELED = '4';
export const ORDER_COMPLETE = '3';
