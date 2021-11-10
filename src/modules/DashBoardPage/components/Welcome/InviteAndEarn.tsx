import { FC } from 'react';
import styles from './InviteAndEarn.module.css';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'components/Button';
import { routes } from 'types/routes';
import { useRouter } from 'next/router';

const InviteAndEarn: FC = () => {
  const router = useRouter();
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
      <FontAwesomeIcon color="var(--orange-dark)" icon={faHandshake} size="10x" />

      <Button type="primary" className={styles.btnStart} onClick={() => router.push(routes.earnings)}>
        Start Now
      </Button>
    </div>
  );
};

export default InviteAndEarn;
