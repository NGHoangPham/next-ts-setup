import { FC } from 'react';
import { Space, Col, Row, Tag, Tooltip } from 'antd';
import styles from './Limit.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';

import { Surface } from 'components/Surface';

const LimitElement: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.card}>
        <p className="text-12 small"> {t('account_management.limit.fiat')}</p>
        <Row>
          <Col span={11}>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">{t('account_management.limit.daily')}</span>
              <div className="default center">
                <span className="text-18 small">$ 1,000 </span>
                <span className="small"> USD</span>
              </div>
            </Surface>
          </Col>
          <Col span={11} offset={2}>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">{t('account_management.limit.monthly')}</span>
              <div className="default center">
                <span className="text-18 small">$ 10,000 </span>
                <span className="small"> USD</span>
              </div>
            </Surface>
          </Col>
        </Row>
      </div>
      <div className={styles.card}>
        <p className="text-12 small"> {t('account_management.limit.crypto')}</p>
        <Row>
          <Col span={8}>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">{t('account_management.limit.daily')}</span>
              <div className="default center">
                <span className="text-18 small">5 </span>
                <span className="small"> BTC</span>
              </div>
            </Surface>
          </Col>
          <Col span={8} offset={2}>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">{t('account_management.limit.monthly')}</span>
              <div className="default center">
                <span className="text-18 small">20 </span>
                <span className="small"> BTC</span>
              </div>
            </Surface>
          </Col>
        </Row>
      </div>
      <div>
        <FontAwesomeIcon icon={faInfoCircle} className={styles.iconInfo} />
        <Link href="#">
          <a className={styles.link}> {t('account_management.limit.link')}</a>
        </Link>
      </div>
    </>
  );
};

const Limit: FC = () => {
  const { t } = useTranslation();
  return (
    <Surface borderMd className={styles.root}>
      <Tooltip placement="topRight" title={t('account_management.limit.tooltip')} color={'#22242a'}>
        <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
      </Tooltip>
      <Space direction="vertical" className={clsx('w-100', styles.form)}>
        <h3 className={styles.textLimit}>{t('account_management.limit.title')}</h3>
        <Row>
          <Col span={18}>
            <LimitElement />
          </Col>
          <Col span={6}>
            <Tag className={styles.tag}>{t('account_management.limit.tag')}</Tag>
          </Col>
        </Row>
      </Space>
    </Surface>
  );
};

export default Limit;
