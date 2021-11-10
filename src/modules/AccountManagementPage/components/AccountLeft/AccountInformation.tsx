import { FC, useState, useRef } from 'react';
import {
  Row,
  Col,
  Button as ButtonAnt,
  Space,
  Form,
  Upload,
  // Image,
  message,
  Skeleton,
} from 'antd';
import styles from './AccountInformation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { UserOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { useTranslation } from 'next-i18next';

import { Avatar } from 'components/Avatar';
import { Button } from 'components/Button';
import { InputWithLabel } from 'components/Input';
import { Surface } from 'components/Surface';
import { TChangeNickName } from 'api/account/types';
import { useMutation } from 'react-query';
import { changeNickName } from 'api/account/request';
import { TError } from 'api/types';
import { useReferralInfo } from 'api/kyc/queries';
import { useUser } from '@auth0/nextjs-auth0';

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const validateForm = {
  required: '* ${label} is required!',
  types: {
    email: '* ${label} is not a valid email!',
  },
};

const AccountInformation: FC = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const uploader = useRef();
  const [file, setFile] = useState<UploadFile>();
  const [btnEdit, setBtnEdit] = useState(false);

  const { data: referralInfo, status: referralInfoStatus } = useReferralInfo({
    sub: user?.sub || '',
  });

  const { mutate: mutateNickName, status } = useMutation(changeNickName, {
    onSuccess: () => {
      message.success(t('account_management.information.changeNickname_success'));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });
  const onSave = (values: any) => {
    const changeNickName: TChangeNickName = {
      ...values,
    };
    mutateNickName(changeNickName);
    setBtnEdit(false);
  };

  const onSaveFailed = () => {
    message.error('System error!');
  };

  const normFile = (info: any) => {
    if (Array.isArray(info)) {
      return info;
    }

    return info && file;
  };

  const onChange = async (info: any) => {
    if (!info.url && !info.preview) {
      info.preview = await getBase64(info.file);
    }
    // setImage(info.url || info.preview);
    setFile(info.file);
    return false;
  };

  const beforeUpload = () => {
    return false;
  };

  return referralInfoStatus !== 'loading' ? (
    <Form
      onFinish={onSave}
      onFinishFailed={onSaveFailed}
      initialValues={{
        referralCode: referralInfo?.referralCode || '',
        inviter: referralInfo?.inviter || '',
      }}
      validateMessages={validateForm}
    >
      <Surface borderMd className={styles.root}>
        <Form.Item
          // name="upload"
          // valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Row className={styles.headInfo}>
            <Col lg={12} xs={24}>
              <div className={clsx(styles.avatarPic, 'f-start')}>
                <Avatar
                  className={styles.avatar}
                  size={98}
                  // src={userInfo.headImg ? <Image src={userInfo.headImg} /> : ""}
                  icon={<UserOutlined />}
                />
                <div className={styles.upload}>
                  <span className="text-14 primary">{t('account_management.information.upload_text')}</span>
                  <p className="text-12 secondary">{t('account_management.information.max_file')}</p>
                  <Upload
                    beforeUpload={beforeUpload}
                    listType="picture"
                    maxCount={1}
                    name="upload"
                    showUploadList={false}
                    onChange={onChange}
                    ref={uploader}
                  >
                    <Button className={styles.btnGo} type="primary">
                      {t('account_management.information.upload_btn')}
                    </Button>
                  </Upload>
                </div>
              </div>
            </Col>
            <Col lg={12} xs={24}>
              <ButtonAnt type="text" className={styles.textChangePass}>
                <Space className="text-14">
                  {t('account_management.information.change_password')}
                  <FontAwesomeIcon icon={faArrowRight} />
                </Space>
              </ButtonAnt>
            </Col>
          </Row>
        </Form.Item>
        <div className={styles.form}>
          <Form.Item name="nickName" label="nickname" rules={[{ required: true }]}>
            <InputWithLabel
              disabled={btnEdit === false ? true : false}
              id="nickname"
              label="NICKNAME"
              placeholder={t('account_management.information.placeholder_nickName')}
            />
          </Form.Item>
          <Form.Item
            // name="email"
            label="email"
            // rules={[{ required: true, type: "email" }]}
          >
            <InputWithLabel
              disabled
              id="email"
              label="EMAIL"
              placeholder={t('account_management.information.placeholder_email')}
            />
          </Form.Item>
          <Form.Item
            // name="phone"
            label="phone"
            // rules={[
            //   { required: true },
            //   {
            //     pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            //     message:
            //       "* phone must be 10 numbers, first number must be 84 or 0",
            //   },
            // ]}
          >
            <InputWithLabel
              disabled
              id="phone"
              label="PHONE"
              placeholder={t('account_management.information.placeholder_phone')}
            />
          </Form.Item>
          <Form.Item name="referralCode">
            <InputWithLabel disabled label="REFERRAL CODE" />
          </Form.Item>
          <Form.Item name="inviter">
            <InputWithLabel disabled label="INVITER" />
          </Form.Item>
        </div>
        {btnEdit && (
          <Button loading={status === 'loading'} htmlType="submit" className={styles.btnSubmit} type="secondary">
            {t('account_management.save_btn')}
          </Button>
        )}
      </Surface>
      {!btnEdit && (
        <Button className={styles.btnEdit} type="primary" onClick={() => setBtnEdit(true)}>
          {t('account_management.edit_btn')}
        </Button>
      )}
    </Form>
  ) : (
    <Skeleton />
  );
};

export default AccountInformation;
