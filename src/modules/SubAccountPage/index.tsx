import { FC } from 'react';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import styles from './styles.module.css';

import { UserInfoSelection } from 'components/UserInfoSelection';
import { SubAccountHeader } from 'components/SubAccountHeader/SubAccountHeader';
import CreateSubAccount from './components/CreateSubAccount';
import SelectSubAccount from './components/SelectSubAccount';
import { TransferSubAccount } from './components/TransferSubAccount';
import { useAppSelector } from 'hooks';

const SubAccountPage: FC = () => {
  const { listSubAccount } = useAppSelector((state) => state.subAccount);

  return (
    <div className={clsx(styles.root, 'container')}>
      <Row gutter={[24, 24]} justify="space-around">
        <Col lg={6} md={0} className={styles.userInfo}>
          <UserInfoSelection />
        </Col>
        <Col lg={18} md={24}>
          <SubAccountHeader />
          <CreateSubAccount />
          {listSubAccount.length ? (
            <>
              <SelectSubAccount />
              <TransferSubAccount />
            </>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SubAccountPage;
