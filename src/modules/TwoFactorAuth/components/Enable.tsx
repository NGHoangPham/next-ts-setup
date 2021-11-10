import React from 'react';
import styles from '../styles.module.css';
import { Input, Space, Form, message } from 'antd';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface SaveKeyProps {
  onSuccess?: Function;
}

const SaveKeyForm: React.FC<SaveKeyProps> = ({ onSuccess }) => {
  const onClick = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const onFinish = () => {
    message.success('Success!');
    if (onSuccess) {
      onSuccess();
    }
  };

  const onFinishFailed = () => {
    message.error('System error!');
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} initialValues={{}}>
      <Surface className={styles.surface}>
        <p className={styles.heading}>Please enter the 6 digit key displayed in the authentication app.</p>
        <div className={styles.optionsContainer}>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[0]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[1]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[2]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[3]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[4]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
          <Form.Item className={clsx(styles.actionButton, styles.inputSquareWrap)} name="code[5]">
            <Input className={styles.inputSquare} placeholder="_" maxLength={1} />
          </Form.Item>
        </div>
        <Button htmlType="submit" className={styles.btnSubmit} type="secondary" onClick={onClick}>
          <Space align="center">
            Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Space>
        </Button>
      </Surface>
    </Form>
  );
};

export default SaveKeyForm;
