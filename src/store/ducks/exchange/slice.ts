import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export interface TExchangeReducer {
  orderBookSelect: any;
  listPairValue: any;
  currentPairValue: any;
  dataDepth: any;
  tradesData: any;
  lastPrice: any;
}

const initialState = {
  orderBookSelect: {},
  listPairValue: [],
  currentPairValue: null,
  dataDepth: {
    bids: [],
    asks: [],
    loadDepthData: false,
  },
  tradesData: {
    history: [],
    lastPriceMoney: 0,
    lastPriceType: 1, // 1: not change, 2: increment, 3: decrement
  },
  lastPrice: 0,
} as TExchangeReducer;

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setOrderBookSelect(state, action: PayloadAction<any>) {
      return {
        ...state,
        orderBookSelect: action.payload,
      };
    },
    setListPairValue(state, action: PayloadAction<any>) {
      return {
        ...state,
        listPairValue: action.payload,
      };
    },
    setCurrentPairValue(state, action: PayloadAction<any>) {
      let temp: any = [...action.payload];
      if (temp?.[2]) {
        temp[2] = parseInt(temp[2]);
      }
      if (temp?.[3]) {
        temp[3] = parseInt(temp[3]);
      }

      return {
        ...state,
        currentPairValue: temp,
      };
    },

    setDataDepth(state, action: PayloadAction<any>) {
      return {
        ...state,
        dataDepth: action.payload,
      };
    },
    setTradesData(state, action: PayloadAction<any>) {
      return {
        ...state,
        tradesData: action.payload,
      };
    },
    setLastPrice(state, action: PayloadAction<any>) {
      return {
        ...state,
        lastPrice: action.payload,
      };
    },
  },
});

export const getExchange = (state: RootState): TExchangeReducer => state.exchange;
export const getOrderBookSelect = (state: RootState): any => state.exchange.orderBookSelect;
export const getCurrentPairValue = (state: RootState): any => state.exchange.currentPairValue;
export const getListPairValue = (state: RootState): any => state.exchange.listPairValue;
export const getTradesData = (state: RootState): any => state.exchange.tradesData;
export const getDataDepth = (state: RootState): any => state.exchange.dataDepth;
export const getLastPrice = (state: RootState): any => state.exchange.lastPrice;

export const { setOrderBookSelect, setListPairValue, setCurrentPairValue, setDataDepth, setTradesData, setLastPrice } =
  exchangeSlice.actions;
export default exchangeSlice.reducer;
