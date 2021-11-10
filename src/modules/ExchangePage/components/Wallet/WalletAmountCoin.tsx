import { FC } from 'react';
import { currencyImgs } from 'assets/images/currency';
import { Avatar } from 'components/Avatar';
import styles from './Wallet.module.css';
import { nDecimalFormat } from 'utils/number';

interface WalletAmountCoinProps {
  coin: string;
  value: string;
}
const WalletAmountCoin: FC<WalletAmountCoinProps> = ({ coin, value }) => {
  return (
    <div className={styles.walletCoin}>
      <Avatar
        size={22}
        type="secondary"
        src={currencyImgs[coin] || currencyImgs.GENERIC}
        className={styles.currencyIcon}
      />
      <div className={styles.walletAmount}>
        <div>
          <span>{nDecimalFormat(value, 2)}</span>
        </div>
        <div
          className={styles.usdAmount}
          title={`$${nDecimalFormat('' + (coin === 'USDT' ? value : Number(value) * 23000), 2)}`}
        >
          ${nDecimalFormat('' + (coin === 'USDT' ? value : Number(value) * 23000), 2)}
        </div>
      </div>
    </div>
  );
};

export default WalletAmountCoin;
