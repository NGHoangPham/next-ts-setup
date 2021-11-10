import React from 'react';
import styles from '../styles.module.css';
import { message, Space } from 'antd';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import QRCode from '../assets/img/QRCode.png';
import CopyImage from '../assets/img/CopyImage.png';

interface AddKeyProps {
  onSuccess?: Function;
}

const AddKeyForm: React.FC<AddKeyProps> = ({ onSuccess }) => {
  const key = 'K3R4GJJJHPF4QXIC';
  const onClick = () => {
    if (onSuccess) {
      onSuccess();
    }
  };
  const onCopy = () => {
    navigator.clipboard.writeText(key);
    message.success('copied');
  };

  return (
    <Surface className={styles.surface}>
      <p className={styles.heading}>
        Please download the key below. It is used as a recovery if 2-step Authentification is cancelled.
      </p>
      <div className={styles.optionsContainer}>
        <a className={styles.actionButton}>
          <span className={styles.key}>{key}</span>
        </a>
        <a className={styles.actionButton} onClick={onCopy}>
          <img src={CopyImage.src} alt="copy" />
        </a>
        <a className={styles.actionButton}>
          <img src={QRCode.src} alt="qrcode" />
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

export default AddKeyForm;
