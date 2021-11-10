import { USER_COOKIES } from '../../../utils/constant';
import { TListSubAccount } from 'api/sub_account/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { getCookies, removeCookies, setCookies } from 'utils/cookies';

export interface TSubAccountReducer {
  visibleModalCreate: boolean;
  visibleModalTransfer: boolean;
  visibleModalDelete: any;
  currentSubAccount: string;
  mainAccountId: string;
  listSubAccount: TListSubAccount[];
  isLoadingSub: string;
}

const initialState = {
  visibleModalCreate: false,
  visibleModalTransfer: false,
  visibleModalDelete: {},
  currentSubAccount: getCookies(USER_COOKIES.subAccount) ? getCookies(USER_COOKIES.subAccount) : 'Main Account',
  mainAccountId: '',
  listSubAccount: [],
  isLoadingSub: '',
} as TSubAccountReducer;

const subAccountSlice = createSlice({
  name: 'subAccount',
  initialState,
  reducers: {
    setModalCreate(state, action: PayloadAction<any>) {
      return {
        ...state,
        visibleModalCreate: action.payload,
      };
    },
    setModalTransfer(state, action: PayloadAction<any>) {
      return {
        ...state,
        visibleModalTransfer: action.payload,
      };
    },
    setModalDelete(state, action: PayloadAction<any>) {
      return {
        ...state,
        visibleModalDelete: action.payload,
      };
    },
    setCurrentSubAccount(state, action: PayloadAction<any>) {
      if (action.payload === 'Main Account') {
        removeCookies(USER_COOKIES.subAccount);
      } else setCookies(USER_COOKIES.subAccount, action.payload.toString());
      return {
        ...state,
        currentSubAccount: action.payload,
      };
    },
    setListSubAccount(state, action: PayloadAction<any>) {
      return {
        ...state,
        listSubAccount: action.payload,
      };
    },
    setMainAccountId(state, action: PayloadAction<any>) {
      return {
        ...state,
        mainAccountId: action.payload,
      };
    },
    setIsLoadingSub(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoadingSub: action.payload,
      };
    },
  },
});

export const getSubAccount = (state: RootState): TSubAccountReducer => state.subAccount;

export const {
  setModalCreate,
  setModalTransfer,
  setCurrentSubAccount,
  setModalDelete,
  setListSubAccount,
  setMainAccountId,
  setIsLoadingSub,
} = subAccountSlice.actions;

export default subAccountSlice.reducer;
