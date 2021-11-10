import { FC } from 'react';
import styles from './styles.module.css';
import { Row, Col } from 'antd';
import clsx from 'clsx';

import { UserInfoSelection } from 'components/UserInfoSelection';
import AccountManagement from './components';

const DashBoardPage: FC = () => {
  return (
    <div className={clsx(styles.root, 'container')}>
      <Row gutter={[24, 24]} justify="space-around">
        <Col lg={6} md={0} className={styles.userInfo}>
          <UserInfoSelection />
        </Col>
        <Col lg={18} md={24}>
          <AccountManagement />
        </Col>
      </Row>
    </div>
  );
};

export default DashBoardPage;
