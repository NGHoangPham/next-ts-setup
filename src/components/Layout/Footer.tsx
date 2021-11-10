import { FC } from 'react';
import styles from './Footer.module.css';
import clsx from 'clsx';

import { Col, Layout as AntdLayout, Row, Space, Avatar } from 'antd';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTelegramPlane, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { InputWithButton } from 'components/Input';
import { useTranslation } from 'next-i18next';
import { Checkbox } from 'components/Checkbox';

export const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <AntdLayout.Footer className={styles.root}>
      <div className={clsx(styles.content, 'container')}>
        <Row
          // wrap={false}
          gutter={49.5}
          justify="space-between"
          className={styles.row}
        >
          <Col md={8} lg={3}>
            <Link href="/">
              <a>
                <img src="/images/logo.svg" alt="logo" />
              </a>
            </Link>
          </Col>
          <Col className={styles.col} md={8} lg={4}>
            <Space direction="vertical" align="start">
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.about_us')}</a>
              </Link>
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.privacy_policy')}</a>
              </Link>
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.blog')}</a>
              </Link>
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.announcements')}</a>
              </Link>
            </Space>
          </Col>
          <Col className={styles.col} md={8} lg={4}>
            <Space direction="vertical" align="start">
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.help_center')}</a>
              </Link>
              <Link href="#">
                <a className={styles.link}>{t('footer.nav.feedback')}</a>
              </Link>
            </Space>
          </Col>
          <Col className={styles.col} style={{ minWidth: '423px' }} lg={5}>
            <p className={styles.sectionTitle}>{t('footer.subscriber.title')}</p>
            <InputWithButton
              placeholder={t('footer.subscriber.your_email')}
              enterButton={t('footer.subscriber.subscribe')}
            />

            <Checkbox className="my-8">
              {t('footer.agree_term.agree')}
              <span className="underline">{t('footer.agree_term.term')}</span>
            </Checkbox>
          </Col>
          <Col className={styles.col} lg={5}>
            <p className={styles.sectionTitle}>{t('footer.join_community.title')}</p>
            <div className={styles.socialWrapper}>
              <Avatar size="large" icon={<FontAwesomeIcon color="#0088CC" icon={faTelegramPlane} size="xs" />} />
              <Avatar size="large" icon={<FontAwesomeIcon color="#0088CC" icon={faFacebookF} size="xs" />} />
              <Avatar size="large" icon={<FontAwesomeIcon color="#0088CC" icon={faTwitter} size="xs" />} />
              <Avatar size="large" icon={<FontAwesomeIcon color="#5851DB" icon={faInstagram} size="xs" />} />
              <Avatar size="large" icon={<FontAwesomeIcon color="#FF0000" icon={faYoutube} size="xs" />} />
            </div>
          </Col>
        </Row>
        <div className={clsx(styles.textBottom, 'secondary')}>{t('footer.ultorex')}</div>
      </div>
    </AntdLayout.Footer>
  );
};
