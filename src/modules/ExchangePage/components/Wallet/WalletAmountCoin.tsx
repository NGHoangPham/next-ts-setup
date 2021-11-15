import { FC, useMemo } from 'react';
import { currencyImgs } from 'assets/images/currency';
import { Avatar } from 'components/Avatar';
import styles from './Wallet.module.css';
import { nDecimalFormat, nDecimalFormatAdvance } from 'utils/number';

interface WalletAmountCoinProps {
  coin: string;
  value: string;
  assessment: string;
}
const WalletAmountCoin: FC<WalletAmountCoinProps> = ({ coin, value, assessment }) => {
  const usdText = useMemo(() => {
    return assessment ? `$${nDecimalFormat(assessment, 2)}` : '';
  }, [assessment]);

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
          <span>
            {nDecimalFormatAdvance(value, 8, {
              isNoZero: true,
              minPrecision: 2,
            })}
          </span>
        </div>
        <div className={styles.usdAmount} title={usdText}>
          {usdText}
        </div>
      </div>
    </div>
  );
};

export default WalletAmountCoin;
