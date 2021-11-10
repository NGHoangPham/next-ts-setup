import React from 'react';
import styles from './styles.module.css';
import { Form, message } from 'antd';

import { InputWithLabel } from 'components/Input';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';

const ChangePasswordPage: React.FC = () => {
  const onFinish = () => {
    message.success('Success!');
  };

  const onFinishFailed = () => {
    message.error('System error!');
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} initialValues={{}} className={styles.root}>
      <h1 className={styles.title}>CHOOSE PASSWORD</h1>
      <Surface className={styles.surface}>
        <Form.Item name="password" rules={[{ required: true, message: 'Email is required' }]}>
          <InputWithLabel placeholder="Choose a Password " id="password" label="PASSWORD" />
        </Form.Item>
        <Form.Item name="repeatPassword" rules={[{ required: true, message: 'Email is required' }]}>
          <InputWithLabel placeholder="Type The Same Password " id="repeatPassword" label="PASSWORD AGAIN" />
        </Form.Item>
        <Button htmlType="submit" className={styles.btnSubmit} type="secondary">
          Change
        </Button>
      </Surface>
    </Form>
  );
};

export default ChangePasswordPage;
