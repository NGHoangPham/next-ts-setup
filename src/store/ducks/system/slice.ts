import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageCode } from 'charting_library/charting_library.min';
import { RootState } from 'store';
import { USER_COOKIES } from 'utils/constant';
import { getCookies } from 'utils/cookies';

export interface TSystemReducer {
  language: string;
  languageType: number;
  exchange: {
    quickOrder: boolean;
    market: boolean;
    chart: boolean;
    orderBook: boolean;
    openOrders: boolean;
    walletSnap: boolean;
    language: LanguageCode;
    currency: string;
    currentPair: any;
    fullscreen: boolean;
  };
}

const initialState = {
  language: getCookies(USER_COOKIES.language),
  languageType: getCookies(USER_COOKIES.language) === 'en' ? 2 : 5,
  exchange: {
    quickOrder: false,
    market: true,
    chart: true,
    orderBook: true,
    openOrders: true,
    walletSnap: true,
    language: 'en',
    currency: 'USDT',
    currentPair: null,
  },
} as TSystemReducer;

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      return {
        ...state,
        language: action.payload,
      };
    },
    setLanguageType(state) {
      return {
        ...state,
        languageType: state.language === 'en-US' ? 2 : 5,
      };
    },
    setExchange(state, action: PayloadAction<any>) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          [action.payload.name]: action.payload.value,
        },
      };
    },
    setCurrentPair(state, action: PayloadAction<any>) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          currentPair: action.payload,
        },
      };
    },
    setFullscreen(state, action: PayloadAction<any>) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          fullscreen: action.payload,
        },
      };
    },
  },
});

export const getSystem = (state: RootState): TSystemReducer => state.system;

export const getCurrentPair = (state: RootState): any => state.system.exchange.currentPair;

export const { setLanguage, setLanguageType, setExchange, setCurrentPair, setFullscreen } = systemSlice.actions;
export default systemSlice.reducer;
