import { combineReducers } from '@reduxjs/toolkit';

import accountReducer from './account/slice';
import systemReducer from './system/slice';
import exchangeReducer from './exchange/slice';
import historyReducer from './history/slice';
import subAccountReducer from './sub_account/slice';

const createRootReducer = () => {
  return combineReducers({
    account: accountReducer,
    system: systemReducer,
    exchange: exchangeReducer,
    history: historyReducer,
    subAccount: subAccountReducer,
  });
};

export default createRootReducer;
