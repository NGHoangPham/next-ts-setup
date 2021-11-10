import { FC, useMemo } from 'react';
import styles from './AccountStatusStepper.module.css';
import { Space } from 'antd';

import { Surface } from 'components/Surface';
import { Steps } from 'components/Steps';
import { Button } from 'components/Button';
import { SKIP_ID_URI } from 'utils/constant';
import { TGetUserInfoResponse, useGetUserInfo } from 'api/account';
import { useUser } from '@auth0/nextjs-auth0';

const { Step } = Steps;

interface SetupTFProps {
  user?: TGetUserInfoResponse;
}

const SetupTwoFactor: FC<SetupTFProps> = ({ user }) => {
  const isActiveMFA = useMemo(() => {
    return user?.use_mfa || false;
  }, [user]);

  const setupSecure = () => {
    if (isActiveMFA) {
      window.open(`${SKIP_ID_URI}/mfa/disable`);
    } else {
      window.open(`${SKIP_ID_URI}/mfa/enable`);
    }
  };

  return (
    <div className={styles.descriptionWrapper}>
      <p>Setup 2-Factor to secure your account</p>
      <Button className={styles.btnGo} type="primary" onClick={() => setupSecure()}>
        Go
      </Button>
    </div>
  );
};

const AccountStatusStepper: FC = () => {
  const { user } = useUser();
  const { data } = useGetUserInfo({ sub: user?.sub || '' });

  return (
    <Surface borderMd className={styles.root}>
      <Space direction="vertical" size={0}>
        <p className={styles.description}>You are a few steps away from starting your crypto investments!</p>
      </Space>
      <Steps className={styles.stepper} labelPlacement="vertical" current={1}>
        <Step title="Register" />
        <Step title="Secure" description={<SetupTwoFactor user={data} />} />
        <Step title="Verify" />
        <Step title="Deposit" />
      </Steps>
    </Surface>
  );
};

export default AccountStatusStepper;
