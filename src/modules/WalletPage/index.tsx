import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Row, Col, message } from 'antd';
import HeaderContent from './components/HeaderContent';
import styles from './styles.module.css';
import { UserInfoSelection } from 'components/UserInfoSelection';
import WalletTable from './components/WalletTable';
import BannerWallet from './components/BannerWallet';
import { getMarketQuery } from 'api/market';
import { SubAccountHeader } from 'components/SubAccountHeader/SubAccountHeader';
import { useMutation } from 'react-query';
import { getWalletQuery } from 'api/wallet/request';
import { useAppSelector } from 'hooks';

const WalletPage: FC = () => {
  const { currentSubAccount } = useAppSelector((state) => state.subAccount);
  const [dataWallet, setDataWallet] = useState<any>([]);
  const [dataMarket, setDataMarket] = useState<any>([]);

  useEffect(() => {
    mutateWallet();
    mutateMarket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubAccount]);

  const { mutate: mutateWallet } = useMutation(getWalletQuery, {
    onSuccess: (data) => {
      setDataWallet(data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateMarket } = useMutation(getMarketQuery, {
    onSuccess: (data) => {
      setDataMarket(data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  return (
    <div className={clsx(styles.root, 'container')}>
      <Row gutter={[24, 24]} justify="space-around">
        <Col lg={6} md={0} className={styles.userInfo}>
          <UserInfoSelection />
        </Col>
        <Col lg={18} md={24}>
          <SubAccountHeader />
          <HeaderContent
            coins={dataWallet?.coins || []}
            assessment={dataWallet?.assessment || ''}
            marketList={dataMarket || []}
          />
          <WalletTable tableData={dataWallet?.coins || []} />
          <BannerWallet />
        </Col>
      </Row>
    </div>
  );
};

export default WalletPage;
