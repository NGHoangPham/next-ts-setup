import { FC } from 'react';
import { Col, Row } from 'antd';
import { JoinStakeBanner } from 'components/JoinStakeBanner';
import { InviteAndEarn } from 'components/InviteAndEarnBanner';

const BannerWallet: FC = () => {
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col lg={24} xl={12}>
        <JoinStakeBanner />
      </Col>
      <Col lg={24} xl={12}>
        <InviteAndEarn />
      </Col>
    </Row>
  );
};

export default BannerWallet;
