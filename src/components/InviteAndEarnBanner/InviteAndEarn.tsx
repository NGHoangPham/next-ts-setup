import { FC } from 'react';
import styles from './InviteAndEarn.module.css';

import { Button } from 'components/Button';
import HandSake from './assets/handshake.png';

export const InviteAndEarn: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.textWrapper}>
        <h1 className={styles.bigTitle}>Invite & Earn</h1>
        <p>Start earning as much as</p>
        <div className={styles.earningDetail}>
          <span>0.4%</span>
          <span className="medium">&ensp; /trx</span>
        </div>
      </div>

      <div>
        <img src={HandSake.src} alt="handSake" />
      </div>
      <Button type="primary" className={styles.btnStart}>
        Start Now
      </Button>
    </div>
  );
};
