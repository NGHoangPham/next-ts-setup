import { Col, Row, Space, Tooltip } from 'antd';
import { FC, useMemo } from 'react';
import styles from './AccountSetup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';

import { Surface } from 'components/Surface';
import { Button } from 'components/Button';

import SecureIcon from 'modules/AccountManagementPage/assets/icon-secure.png';
import VerifiedIcon from 'modules/AccountManagementPage/assets/icon-verified.png';
import ActiveSecure from 'modules/AccountManagementPage/assets/active-secure.png';
import ActiveVerified from 'modules/AccountManagementPage/assets/active-verified.png';
import UnderReview from 'modules/AccountManagementPage/assets/under-review.png';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { routes } from 'types/routes';
import { SKIP_ID_URI } from 'utils/constant';
import { TGetUserInfoResponse, useGetUserInfo } from 'api/account';

interface MFAProps {
  user?: TGetUserInfoResponse;
}

const MFA: FC<MFAProps> = ({ user }) => {
  const { t } = useTranslation();

  const isActiveMFA = useMemo(() => {
    return user?.use_mfa || false;
  }, [user]);

  const handleMFA = () => {
    if (isActiveMFA) {
      window.open(`${SKIP_ID_URI}/mfa/disable`);
    } else {
      window.open(`${SKIP_ID_URI}/mfa/enable`);
    }
  };

  return (
    <Surface borderMd className={styles.root}>
      <Space direction="vertical" className="w-100">
        <Tooltip placement="topRight" title={t('account_management.mfa_tooltip')} color={'#22242a'}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Tooltip>
        <div className={styles.form}>
          <img alt="secure" src={isActiveMFA ? ActiveSecure.src : SecureIcon.src} />
          <h4 className="text-14 small">
            {isActiveMFA
              ? t('account_management.setup.MFA_enable_title')
              : t('account_management.setup.MFA_disable_title')}
          </h4>
          <p className={styles.description}>
            {isActiveMFA
              ? t('account_management.setup.MFA_enable_description')
              : t('account_management.setup.MFA_disable_description')}
          </p>
          <Button type="primary" className={styles.btn} onClick={handleMFA}>
            {isActiveMFA
              ? t('account_management.setup.MFA_disable_button')
              : t('account_management.setup.MFA_enable_button')}
          </Button>
        </div>
      </Space>
    </Surface>
  );
};

interface KYCProps {
  user?: TGetUserInfoResponse;
}

const KYC: FC<KYCProps> = ({ user }) => {
  const { t } = useTranslation();

  const get = {
    kycStatus() {
      return user?.kyc_status || 0;
    },
    kycTitle() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return t('account_management.setup.KYC_submitted_title');
        case 2:
          return t('account_management.setup.KYC_passed_title');
        case 3:
          return t('account_management.setup.KYC_failed_title');
        default:
          return t('account_management.setup.KYC_not_verified_title');
      }
    },
    kycIcon() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return UnderReview;
        case 2:
          return ActiveVerified;
        case 3:
          return VerifiedIcon;
        default:
          return VerifiedIcon;
      }
    },
    kycDescription() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return t('account_management.setup.KYC_submitted_description');
        case 2:
          return t('account_management.setup.KYC_passed_description');
        case 3:
          return t('account_management.setup.KYC_failed_description');
        default:
          return t('account_management.setup.KYC_not_verified_description');
      }
    },
    isShowKYCButton() {
      const status = this.kycStatus();
      return status !== 1;
    },
    KYCButtonText() {
      const status = this.kycStatus();
      switch (status) {
        case 2:
          return 'Disable';
        default:
          return t('account_management.setup.verified_btn');
      }
    },
  };

  return (
    <Surface borderMd className={styles.root}>
      <Space direction="vertical" className="w-100">
        <Tooltip placement="topRight" title={t('account_management.kyc_tooltip')} color={'#22242a'}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Tooltip>
        <div className={styles.form}>
          <img alt="image" src={get.kycIcon().src} />
          <h4 className="text-14 small">{get.kycTitle()}</h4>
          <p className={styles.description}>{get.kycDescription()}</p>
          {get.isShowKYCButton() ? (
            <Link href={routes.identifyVerification}>
              <a>
                <Button type="primary" className={styles.btn} disabled={get.kycStatus() === 2}>
                  {get.KYCButtonText()}
                </Button>
              </a>
            </Link>
          ) : (
            ''
          )}
        </div>
      </Space>
    </Surface>
  );
};

const AccountSetup: FC = () => {
  const { user } = useUser();
  const { data } = useGetUserInfo({ sub: user?.sub || '' }, { refetchInterval: 10000 });

  return (
    <Row gutter={[48, 0]}>
      <Col span={12}>
        <MFA user={data} />
      </Col>
      <Col span={12}>
        <KYC user={data} />
      </Col>
    </Row>
  );
};

export default AccountSetup;
