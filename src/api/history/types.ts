export interface TOrderTableItem {
  amount: string;
  coinName: string;
  feeNumber: string;
  orderId: string;
  pair: string;
  price: string;
  sell: boolean;
  time: string;
  total: string;
  tradeId: string;
}

export interface TSuccessResponse {
  orders: Array<TOrderTableItem>;
  page: {
    countNumber: number;
    countPage: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface TRequestHistory {
  symbol?: string;
  type: number;
  state?: string;
  start_time?: any;
  end_time?: any;
  order_id?: string;
  page: number;
  page_size: number;
}

export interface THistoryPageInfo {
  countNumber?: number;
  countPage?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface THistoryData {
  amount?: string;
  avgPrice?: string;
  limitPrice?: string;
  money?: string;
  orderId?: string;
  orderType?: string;
  pair?: string;
  price?: string;
  sell?: boolean;
  state?: number;
  time?: string;
  total?: string;
  tradeAmount?: string;
}
export interface TCancelOrder {
  order_id: string;
  type: number;
}

export interface TCancelAllOrder {
  demoFlag: number;
}

export interface TTradeHistory {
  amount?: string;
  coinName?: string;
  feeNumber?: string;
  orderId?: string;
  pair?: string;
  price?: string;
  sell?: boolean;
  total?: string;
  time?: string;
  tradeId?: string;
}
