import React from 'react';
import styles from './Congratulation.module.css';
import { Result } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import CheckIcon from '../assets/img/CheckIcon.png';

import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { routes } from 'types/routes';
import Link from 'next/link';

const Congratulation: React.FC = () => {
  return (
    <Surface className={styles.surface}>
      <Result
        status="success"
        icon={<img className={styles.icon} alt="check" src={CheckIcon.src} />}
        title={<span className={styles.title}>Your Subscription Is Successful</span>}
        subTitle={
          <p className={styles.description}>
            Thanks for completing your subscription.
            <br />
            Your documents will be verified soon.
          </p>
        }
        extra={[
          <Button type="secondary" key="dashboard">
            <Link href={routes.accountManagement}>
              <a>
                To Dashboard <ArrowRightOutlined />
              </a>
            </Link>
          </Button>,
        ]}
      />
    </Surface>
  );
};

export default Congratulation;
