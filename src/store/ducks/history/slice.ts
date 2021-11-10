import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { THistoryData, THistoryPageInfo, TTradeHistory } from 'api/history';
import { RootState } from 'store';

export interface THistoryReducer {
  orderHistoryList: THistoryData[];
  tradeHistoryList: TTradeHistory[];
  isLoadingHistory: boolean;
  pageInfo: THistoryPageInfo;
}

const initialState = {
  orderHistoryList: [],
  tradeHistoryList: [],
  isLoadingHistory: false,
  pageInfo: {},
} as THistoryReducer;

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setOrderHistory(state, action: PayloadAction<any>) {
      return {
        ...state,
        orderHistoryList: action.payload,
      };
    },
    setTradeHistory(state, action: PayloadAction<any>) {
      return {
        ...state,
        tradeHistoryList: action.payload,
      };
    },
    setIsLoadingHistory(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isLoadingHistory: action.payload,
      };
    },
    setPageInfo(state, action: PayloadAction<any>) {
      return {
        ...state,
        pageInfo: action.payload,
      };
    },
  },
});

export const getHistory = (state: RootState): THistoryReducer => state.history;

export const { setOrderHistory, setIsLoadingHistory, setPageInfo, setTradeHistory } = historySlice.actions;
export default historySlice.reducer;
