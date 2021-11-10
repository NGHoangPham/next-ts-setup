import { CSSProperties, FC, ReactNode } from 'react';
import commonStyles from './common.module.css';
import styles from './Why.module.css';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

interface WhyItemProps {
  text: string;
  title: string;
  style?: CSSProperties;
  icon: ReactNode;
}

const WhyTopItem: FC<WhyItemProps> = ({ style, text, title, icon }) => {
  return (
    <Col span={12} style={style}>
      <div className={clsx(styles.why, styles.whyTop)}>
        {icon}
        <p className={clsx(styles.text, styles.itemTopSpace)}>{text}</p>
        <p className={styles.title}>{title}</p>
      </div>
    </Col>
  );
};

const WhyTop: FC = () => {
  const { t } = useTranslation();
  return (
    <Row className={commonStyles.root}>
      <Col md={24} lg={24}>
        <div>
          <h2 className={commonStyles.title}>{t('homepage.why.title')}</h2>
          <p className={clsx(commonStyles.subtitle, styles.footerText)}>{t('homepage.why.footer_text')}</p>
        </div>
      </Col>
      <Col md={24} lg={12}>
        <div>
          <img className={styles.bullWithCoinImage} alt="bull-with-coin" src="/images/home/bull_coin.png" />
        </div>
      </Col>
      <Col md={24} lg={12}>
        <Row gutter={[42, 42]}>
          <WhyTopItem
            text={t('homepage.why.text_1')}
            title={t('homepage.why.title_1')}
            icon={<img className={styles.iconTop} alt="top-icon" src="/images/home/tachometer-fastest.png" />}
          />
          <WhyTopItem
            text={t('homepage.why.text_2')}
            title={t('homepage.why.title_2')}
            icon={<img className={styles.iconTop} alt="fingerprint" src="/images/home/fingerprint.png" />}
          />
          <WhyTopItem
            text={t('homepage.why.text_3')}
            title={t('homepage.why.title_3')}
            icon={<img className={styles.iconTop} alt="fighter-jet" src="/images/home/fighter-jet.png" />}
          />
          <WhyTopItem
            text={t('homepage.why.text_4')}
            title={t('homepage.why.title_4')}
            icon={<img className={styles.iconTop} alt="water" src="/images/home/water.png" />}
          />
        </Row>
      </Col>
    </Row>
  );
};

const WhyBottomItem: FC<WhyItemProps> = ({ style, text, title, icon }) => {
  return (
    <Col md={8} lg={4} style={style}>
      <div className={clsx(styles.why, styles.whyBottom)}>
        {icon}
        <p className={clsx(styles.title, styles.itemBottomSpace)}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
    </Col>
  );
};

const WhyBottom: FC = () => {
  const { t } = useTranslation();
  return (
    <Row justify="space-around" className={commonStyles.root}>
      <WhyBottomItem
        text={t('homepage.why.bottom_text_1')}
        title={t('homepage.why.bottom_title_1')}
        icon={<img className={styles.iconBottom} src="/images/home/spot.png" alt="spot" />}
      />
      <WhyBottomItem
        text={t('homepage.why.bottom_text_2')}
        title={t('homepage.why.bottom_title_2')}
        icon={<img className={styles.iconBottom} src="/images/home/margin.png" alt="margin" />}
      />
      <WhyBottomItem
        text={t('homepage.why.bottom_text_3')}
        title={t('homepage.why.bottom_title_3')}
        icon={<img className={styles.iconBottom} alt="staking" src="/images/home/staking.png" />}
      />
      <WhyBottomItem
        text={t('homepage.why.bottom_text_4')}
        title={t('homepage.why.bottom_title_4')}
        icon={<img className={styles.iconBottom} alt="mobile_app" src="/images/home/mobile_app.png" />}
      />
      <WhyBottomItem
        text={t('homepage.why.bottom_text_5')}
        title={t('homepage.why.bottom_title_5')}
        icon={<img className={styles.iconBottom} alt="pro-tool" src="/images/home/pro_tool.png" />}
      />
    </Row>
  );
};

export const Why: FC = () => {
  return (
    <section className="container">
      <WhyTop />
      <WhyBottom />
    </section>
  );
};
