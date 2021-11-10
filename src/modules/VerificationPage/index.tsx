import { FC } from 'react';
import styles from './styles.module.css';

import VerificationHeader from './components/VerificationHeader';
import VerificationForm from './components/VerificationForm';

const EmailVerificationPage: FC = () => {
  return (
    <div className={styles.root}>
      <VerificationHeader />
      <VerificationForm />
    </div>
  );
};

export default EmailVerificationPage;
