export interface WalletTableItem {
  coinType: string;
  totalNumber: string;
  lockNumber: string;
  number: string;
  assessment: string;
}
export interface WalletGroupItem {
  coins: Array<WalletTableItem>;
  assessment: string;
  coinsLimitMap: Object;
}
