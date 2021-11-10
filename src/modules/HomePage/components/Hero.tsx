import { FC } from 'react';
import styles from './Hero.module.css';

import { useTranslation } from 'next-i18next';

import { Button } from 'components/Button';
import { Carousel } from 'components/Carousel';
import { routes } from 'types/routes';
import { Col, Row } from 'antd';
import { useRouter } from 'next/router';

export const Hero: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const onStartNow = () => {
    router.push(routes.trade);
  };
  return (
    <section className={styles.root}>
      <Carousel className={styles.carousel}>
        <Row className={styles.content}>
          <Col md={13}>
            <img className={styles.img} alt="bull" src="/images/home/moon.png" />
          </Col>
          <Col md={11} className={styles.description}>
            <h1 className={styles.title}>{t('homepage.hero.title')}</h1>
            <div>
              <p className={styles.subtitle}>{t('homepage.hero.subtitle')}</p>
              <Button size="large" className={styles.btnStartNow} type="primary" onClick={onStartNow}>
                {t('homepage.hero.start_now')}
              </Button>
            </div>
          </Col>
        </Row>
        <Row className={styles.content}>
          <Col md={13}>
            <img className={styles.img} alt="bull" src="/images/home/moon.png" />
          </Col>
          <Col md={11} className={styles.description}>
            <h1 className={styles.title}>{t('homepage.hero.title')}</h1>
            <div>
              <p className={styles.subtitle}>{t('homepage.hero.subtitle')}</p>
              <Button size="large" className={styles.btnStartNow} type="primary" onClick={onStartNow}>
                {t('homepage.hero.start_now')}
              </Button>
            </div>
          </Col>
        </Row>
      </Carousel>
    </section>
  );
};
