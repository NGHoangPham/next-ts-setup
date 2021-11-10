import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { initialCurrentCurrency, USER_COOKIES } from 'utils/constant';
import { getCookies, setCookies } from 'utils/cookies';

export interface TAccountReducer {
  currentCurrency: any;
}

const currentCurrency = !getCookies(USER_COOKIES.currentCurrency)
  ? setCookies(USER_COOKIES.currentCurrency, JSON.stringify(initialCurrentCurrency))
  : getCookies(USER_COOKIES.currentCurrency);

const initialState = {
  currentCurrency: currentCurrency || JSON.stringify(initialCurrentCurrency),
} as TAccountReducer;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setCurrentCurrency(state, action: PayloadAction<any>) {
      setCookies(USER_COOKIES.currentCurrency, action.payload);
      return initialState;
    },
  },
});

export const getAccount = (state: RootState): TAccountReducer => state.account;
export const { setCurrentCurrency } = accountSlice.actions;
export default accountSlice.reducer;
