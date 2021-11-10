import { FC } from 'react';
import { Typography, Row, Col } from 'antd';

import { InviteAndEarn } from 'components/InviteAndEarnBanner';
import AccountStatusStepper from './AccountStatusStepper';
import AccountBalance from './AccountBalance';
import Referrals from './Referrals';
import LatestActivity from './LatestActivity';
import WatchList from './WatchList';
import OpenOrder from './OpenOrder';
import styles from './styles.module.css';

const WellcomeComponent: FC = () => {
  return (
    <div className={styles.root}>
      <Typography.Title level={3}>Welcome to ULTOREX!</Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xl={13} lg={24}>
          <Row gutter={[0, 24]}>
            <AccountStatusStepper />
            <AccountBalance />
            <WatchList />
          </Row>
        </Col>
        <Col xl={11} lg={24}>
          <Row gutter={[0, 24]}>
            <InviteAndEarn />
            <Referrals />
            <LatestActivity />
          </Row>
        </Col>
        <Col span={24}>
          <OpenOrder />
        </Col>
      </Row>
    </div>
  );
};

export default WellcomeComponent;
