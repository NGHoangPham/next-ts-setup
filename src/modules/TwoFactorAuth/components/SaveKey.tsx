import React from 'react';
import styles from '../styles.module.css';
import { Space } from 'antd';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import Download from '../assets/img/Download.png';

interface SaveKeyProps {
  onSuccess?: Function;
}

const SaveKeyForm: React.FC<SaveKeyProps> = ({ onSuccess }) => {
  const key = 'K3R4GJJJHPF4QXIC';
  const onClick = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Surface className={styles.surface}>
      <p className={styles.heading}>
        Open an authentication app and scan the QR code or directly add the following key to the app.
      </p>
      <div className={styles.optionsContainer}>
        <a className={styles.actionButton}>
          <span className={styles.key}>{key}</span>
        </a>
        <a className={styles.actionButton}>
          <img src={Download.src} alt="download" />
        </a>
      </div>
      <Button className={styles.btnSubmit} type="secondary" onClick={onClick}>
        <Space align="center">
          Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
        </Space>
      </Button>
    </Surface>
  );
};

export default SaveKeyForm;
