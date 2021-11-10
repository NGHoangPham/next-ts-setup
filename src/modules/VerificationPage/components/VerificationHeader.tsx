import React from 'react';
import styles from './VerificationHeader.module.css';

const VerificationHeader: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>EMAIL VERIFICATION</h3>
      <div className={styles.textInfo}>Please enter the 6-digit verification code that was sent to:</div>
      <span className={styles.textInfo}>weqwe@gmail.com</span>
      <div className={styles.textInfo}>The code is valid for 30 minutes.</div>
    </div>
  );
};

export default VerificationHeader;
