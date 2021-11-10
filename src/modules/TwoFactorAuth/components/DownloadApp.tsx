import React from 'react';
import styles from '../styles.module.css';
import { Space } from 'antd';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import AppStore from '../assets/img/AppStore.png';
import GooglePlay from '../assets/img/GooglePlay.png';
import QRCode from '../assets/img/QRCode.png';

interface DownloadAppProps {
  onSuccess?: Function;
}

const DownloadAppForm: React.FC<DownloadAppProps> = ({ onSuccess }) => {
  return (
    <Surface className={styles.surface}>
      <p className={styles.heading}>Download the authentication app</p>
      <div className={styles.optionsContainer}>
        <a className={styles.actionButton}>
          <img src={AppStore.src} alt="appstore" />
        </a>
        <a className={styles.actionButton}>
          <img src={GooglePlay.src} alt="googleplay" />
        </a>
        <a className={styles.actionButton}>
          <img src={QRCode.src} alt="qrcode" />
        </a>
      </div>
      <Button
        className={styles.btnSubmit}
        type="secondary"
        onClick={() => {
          if (onSuccess) {
            onSuccess();
          }
        }}
      >
        <Space align="center">
          Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
        </Space>
      </Button>
    </Surface>
  );
};

export default DownloadAppForm;
