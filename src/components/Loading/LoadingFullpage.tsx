import { FC } from 'react';
import styles from './LoadingFullpage.module.css';
import { Spin } from 'antd';
import Logo from 'assets/images/logo.svg';

export const LoadingFullpage: FC = () => {
  return (
    <div className={styles.root}>
      <img src={Logo} className={styles.logo} />
      <Spin />
    </div>
  );
};
