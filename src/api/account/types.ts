export interface CurrencyGroupItemResponse {
  coinType: any;
  rate: string;
  symbol?: string;
}

export interface TGetIndexResponse {
  token: string;
}

export interface TChangeNickName {
  nickName: string;
}

export interface TChangeNickNameResponse {
  user: {
    account: string;
    accountId: string;
    autoLockType: number;
    credit: number;
    defPool: number;
    direct: number;
    headImg: string;
    invitationUser: string;
    isLeverage: number;
    nickName: string;
    partnerCountSign: number;
    partnerId: string;
    phone: string;
    status: number;
  };
}

export interface TGetUserInfoRequest {
  sub: string;
}
export interface TGetUserInfoResponse {
  use_mfa: boolean;
  kyc_status: number;
}

export interface TGetCurrentCurrency {
  coinType: any;
  rate: number;
  symbol: string;
}
