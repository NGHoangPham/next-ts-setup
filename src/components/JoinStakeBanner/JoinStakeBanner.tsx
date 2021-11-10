import { FC } from 'react';
import styles from './styles.module.css';

import { Button } from 'components/Button';
import { routes } from 'types/routes';
import { useRouter } from 'next/router';

export const JoinStakeBanner: FC = () => {
  const router = useRouter();
  const onClickLearnMore = () => {
    router.push(routes.earnings);
  };
  return (
    <div className={styles.card}>
      <div className={styles.leftWrapper}>
        <span className={styles.bigTitle}>Join Now!</span>
        <br />
        <span>Limited Time</span>
        <br />
        <span className={styles.blueText}>Moon Stake</span>
      </div>

      <div className={styles.imgWrapper}>
        <img src="/images/moon.png" alt="moon" />
      </div>
      <div className={styles.rightWrapper}>
        <p>Start earning as much as</p>
        <div className={styles.percentInfo}>
          <b className="bolder text-20">20.21%</b> <span>P.A</span>
        </div>
        <p className="right">for your ETH, ADA, ATOM and DOT!</p>
      </div>
      <Button type="info" className={styles.btn} onClick={onClickLearnMore}>
        Learn More
      </Button>
    </div>
  );
};
