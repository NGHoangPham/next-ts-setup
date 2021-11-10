import { FC } from 'react';
// import styles from "./styles.module.css";
import { Row, Col, Typography, Button, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';

import AccountLeft from './AccountLeft';
import AccountRight from './AccountRight';

const AccountManagementPage: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col lg={13} md={14} sm={13}>
          <Typography.Title level={3}>{t('account_management.title')}</Typography.Title>
        </Col>
        <Col lg={11} md={9} sm={10}>
          <div className="f-end -mr-15">
            <Button type="text" className="right">
              <Space className="text-14">
                {t('account_management.latest_activity')}
                <FontAwesomeIcon icon={faArrowRight} />
              </Space>
            </Button>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col lg={13} md={23} sm={24}>
          <AccountLeft />
        </Col>
        <Col lg={11} md={23} sm={24}>
          <AccountRight />
        </Col>
      </Row>
    </div>
  );
};

export default AccountManagementPage;
