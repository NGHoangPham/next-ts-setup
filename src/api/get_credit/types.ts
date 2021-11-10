export interface TGetDigitalCoin {
  digitalCurrency: string;
  fiatCurrency: string;
  fiatAmount: number;
  target: string;
}

export interface TGetDigitalFiat {
  digitalCurrency: string;
  fiatCurrency: string;
  digitalAmount: number;
  target: string;
}

export interface TDigitalMoney {
  amount: string;
  currency: string;
}

export interface TFiatMoney {
  base_amount: string;
  currency: string;
  total_amount: string;
}

export interface TDigitalCoinItem {
  digital_money: TDigitalMoney;
  fiat_money: TFiatMoney;
  quote_id: TFiatMoney;
  supported_digital_currencies: string[];
  supported_fiat_currencies: string[];
  user_id: string;
  valid_until: string;
  wallet_id: string;
}

export interface TLimitFiat {
  type: string;
  fiat_currency: string;
}

export interface TResponseLimit {
  kycMaxLimit: string;
  kycMinLimit: string;
  maxLimit: string;
  minLimit: string;
}
