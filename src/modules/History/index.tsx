import { FC } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Row, Col } from 'antd';
import { UserInfoSelection } from 'components/UserInfoSelection';
import Title from './components/Title';
import MainContent from './components/MainContent';

const History: FC = () => {
  return (
    <div className={clsx(styles.root, 'container')}>
      <Row gutter={[24, 24]} justify="space-around">
        <Col lg={6} md={0} className={styles.userInfo}>
          <UserInfoSelection />
        </Col>
        <Col lg={18} md={24}>
          <Title />
          <MainContent />
        </Col>
      </Row>
    </div>
  );
};

export default History;
