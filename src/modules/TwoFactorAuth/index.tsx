import { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Steps } from 'components/Steps';
import { Button, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import DownloadApp from './components/DownloadApp';
import AddKey from './components/AddKey';
import SaveKey from './components/SaveKey';
import Enable from './components/Enable';

const { Step } = Steps;

const TwoFactorAuth: FC = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className={styles.root}>
      <div className={clsx('f-end', styles.howTo)}>
        <Button type="text">
          <Space className="secondary">
            How To <FontAwesomeIcon icon={faQuestionCircle} />
          </Space>
        </Button>
      </div>

      <h1 className={styles.title}>SECURE YOUR ACCOUNT</h1>
      <p className="primary text-18 center">Setup 2-Factor-Authentication to maximise security</p>

      <Steps className={styles.stepper} labelPlacement="vertical" current={current}>
        <Step title="Download App" />
        <Step title="Add Key" />
        <Step title="Save Key" />
        <Step title="Enable" />
      </Steps>

      {current === 0 ? (
        <DownloadApp
          onSuccess={() => {
            setCurrent(1);
          }}
        />
      ) : null}
      {current === 1 ? (
        <AddKey
          onSuccess={() => {
            setCurrent(2);
          }}
        />
      ) : null}
      {current === 2 ? (
        <SaveKey
          onSuccess={() => {
            setCurrent(3);
          }}
        />
      ) : null}
      {current === 3 ? (
        <Enable
          onSuccess={() => {
            //
          }}
        />
      ) : null}
    </div>
  );
};

export default TwoFactorAuth;
