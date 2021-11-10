import React, { useState } from 'react';
import styles from './UploadDocument.module.css';
import { Col, Form, message, Row, Space } from 'antd';

import { InputWithLabel } from 'components/Input';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { FileUpload } from 'components/FileUpload';

import { SelectWithLabel, Option } from 'components/Select/SelectWithLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from '../assets/img/Profile.png';
import FrontSideImage from '../assets/img/FrontSide.png';
import BackSideImage from '../assets/img/BackSide.png';
import { useTranslation } from 'react-i18next';

interface UploadDocumentProps {
  onSuccess?: Function;
  kycData: any[];
  isLoading: boolean;
}

interface TImagePreview {
  front?: File;
  back?: File;
  selfie?: File;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onSuccess, kycData, isLoading }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState<TImagePreview>({});
  const [data, setData] = kycData;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const tempData = { ...data, ...values, ...image };
    setData(tempData);
    if (onSuccess) {
      onSuccess(tempData);
    }
  };

  const onFinishFailed = () => {
    message.error('System error');
  };

  const handleChangeFrontImage = (file: File) => {
    setImage((prev) => ({ ...prev, front: file }));
  };
  const handleChangeBackImage = (file: File) => {
    setImage((prev) => ({ ...prev, back: file }));
  };
  const handleChangeSelfieImage = (file: File) => {
    setImage((prev) => ({ ...prev, selfie: file }));
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} form={form}>
      <Surface className={styles.surface}>
        <Form.Item label="document type" name="documentType" rules={[{ required: true }]}>
          <SelectWithLabel placeholder="Choose document type" label="DOCUMENT TYPE">
            {[1, 2, 3, 4].map((option, index) => (
              <Option key={index} value={option}>
                {t(`kyc.document_type.${option}`)}
              </Option>
            ))}
          </SelectWithLabel>
        </Form.Item>
        <Form.Item label="document ID" name="identityNumber" rules={[{ required: true }]}>
          <InputWithLabel placeholder="Document type" label="DOCUMENT ID" />
        </Form.Item>
        <Row gutter={[15, 15]}>
          <Col span="12">
            <Form.Item style={{ marginBottom: 0 }}>
              <FileUpload
                label="FRONT SIDE"
                description="Upload the front side of your id"
                background={FrontSideImage.src}
                backgroundHeight={50}
                onChangeFile={handleChangeFrontImage}
              />
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item style={{ marginBottom: 0 }}>
              <FileUpload
                label="BACK SIDE"
                description="Upload the back side of your id"
                background={BackSideImage.src}
                backgroundHeight={50}
                onChangeFile={handleChangeBackImage}
              />
            </Form.Item>
          </Col>
          <Col span="24">
            <Form.Item style={{ marginBottom: 0 }}>
              <FileUpload
                label="SELFIE"
                description="Your selfie photo must include"
                lists={[
                  'yourself',
                  'your ID held in hand',
                  'a paper “ULTOREX” and today’s date (MM/DD/YYYY) written on it',
                ]}
                background={ProfileImage.src}
                onChangeFile={handleChangeSelfieImage}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button loading={isLoading} htmlType="submit" className={styles.btnSubmit} type="secondary">
          <Space align="center">
            Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Space>
        </Button>
      </Surface>
    </Form>
  );
};

export default UploadDocument;
