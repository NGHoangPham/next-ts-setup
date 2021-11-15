import { FC } from 'react';
import { Surface } from 'components/Surface';
import styles from './Wallet.module.css';
import { Space, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faTimesCircle, faDotCircle, faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import WalletAmountCoin from './WalletAmountCoin';
import { useAppSelector } from 'hooks/reduxHook';
import { WalletGroupItem, WalletTableItem } from 'api/wallet/types';
import { useTranslation } from 'next-i18next';
import { useWalletQuery } from 'api/wallet';
import { UseQueryResult } from 'react-query';

const { Text } = Typography;

interface WalletProps {}

const Wallet: FC<WalletProps> = () => {
  const { t } = useTranslation();
  const { currentPair } = useAppSelector((state) => state.system.exchange);
  const { data: walletData }: UseQueryResult<WalletGroupItem> = useWalletQuery({
    refetchInterval: 10000,
  });

  return (
    <Surface filled className={styles.wallet}>
      <Space className={styles.item}>
        <Space size={8} align="center">
          <FontAwesomeIcon icon={faWallet} color="#788686" className={styles.icon} />
          <Text type="secondary">{t('exchange.place_order.wallet')}</Text>
        </Space>
        <div>
          <FontAwesomeIcon color="#788686" icon={faTimesCircle} className={styles.iconClose} />
          <FontAwesomeIcon color="#788686" icon={faDotCircle} />
        </div>
      </Space>
      <div className={styles.amountWrapper}>
        {walletData &&
          walletData?.coins &&
          walletData?.coins
            .filter((item: WalletTableItem) => currentPair?.includes(item.coinType))
            .map((item: WalletTableItem, index: number) => (
              <WalletAmountCoin coin={item?.coinType} key={index} value={item?.number} assessment={item?.assessment} />
            ))}
      </div>
      <Space className={styles.bottomContainer}>
        <div className={styles.iconWrap}>
          <FontAwesomeIcon icon={faUpload} color="#788686" className={styles.icon} />
        </div>
        <div className={styles.iconWrap}>
          <FontAwesomeIcon icon={faDownload} color="#788686" className={styles.icon} />
        </div>
      </Space>
    </Surface>
  );
};

export default Wallet;
