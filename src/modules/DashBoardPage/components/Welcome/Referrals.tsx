import { FC, useEffect, useState } from 'react';
import styles from './Referrals.module.css';
import { Space, Slider, Row, Col, Button } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faArrowRight, faUsers } from '@fortawesome/free-solid-svg-icons';

import { Surface } from 'components/Surface';
import Crown from '../../assets/icon-crown.png';
import clsx from 'clsx';
import { Avatar } from 'components/Avatar';
import Pending from 'modules/DashBoardPage/assets/pending@2x.png';
import Success from 'modules/DashBoardPage/assets/group@2x.png';
import Yellow from 'modules/DashBoardPage/assets/yellow.png';
import { useReferralCount, useReferralRank } from 'api/dashboard';
import { nDecimalFormat } from 'utils/number';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';

const Referrals: FC = () => {
  const router = useRouter();
  const [referralAmount, setReferralAmount] = useState<Record<string, string>>({
    0: '$ 0.00',
  });

  const { data: referralRank } = useReferralRank();
  const { data: referralCount } = useReferralCount();

  useEffect(() => {
    if (referralRank) {
      let mark: Record<string, string> = {};
      mark[parseInt(referralRank.amount)] = `$ ${nDecimalFormat(referralRank.amount, 2)}`;
      setReferralAmount(mark);
    }
  }, [referralRank]);
  return (
    <Surface borderMd className={styles.root}>
      <div className="f-between">
        <div className="bold default">REFERRALS</div>
        <FontAwesomeIcon icon={faUsers} color="#788686" size="lg" />
      </div>

      <div className="divider-x my-8" />

      <Row gutter={[12, 12]}>
        <Col span={24}>
          <div className={clsx(styles.card, styles.cardLevel)}>
            <Space size={0} direction="vertical">
              <img alt="crown" src={Crown.src} />
              <span>newuser</span>
              <span className="primary bold text-22">LVL {`${referralRank?.lv}`}</span>
            </Space>
            <Slider
              value={referralRank && parseFloat(nDecimalFormat(referralRank.amount, 2))}
              marks={referralAmount}
              max={referralRank && parseInt(referralRank.max)}
              min={referralRank && parseInt(referralRank.min)}
              disabled
            />
            <div className="f-end -mr-15">
              <Button type="text" icon={<FontAwesomeIcon icon={faAngleDoubleRight} />} className="secondary text-12">
                &nbsp;LVL {referralRank && parseInt(referralRank?.lv) + 1}
              </Button>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className={clsx(styles.card, styles.cardStatictis)}>
            <div className="bold text-45 primary">
              {referralCount &&
                parseInt(referralCount.kyc_count) +
                  parseInt(referralCount.registration_only_count) +
                  parseInt(referralCount.qualified_count)}
            </div>
            <div className="text-16 default center">Referrals</div>
          </div>
        </Col>
        <Col span={16}>
          <div className={clsx(styles.card, styles.cardStatictis, 'f-center')}>
            <Space size={32} split={<div className="divider-y" />}>
              <Space className={styles.statictisItem}>
                <Avatar type="secondary" size={25} src={Pending} />
                <span className={styles.clock}>{referralCount && referralCount.registration_only_count}</span>
              </Space>
              <Space className={styles.statictisItem}>
                <Avatar type="secondary" size={25} src={Success} />
                <span className={styles.check}>{referralCount && referralCount.kyc_count}</span>
              </Space>
              <Space className={styles.statictisItem}>
                <Avatar type="secondary" size={25} src={Yellow} />
                <span className={styles.bull}>{referralCount && referralCount.qualified_count}</span>
              </Space>
            </Space>
          </div>
        </Col>
      </Row>
      <div className="f-end -mr-15">
        <Button type="text" className="right" onClick={() => router.push(routes.referral)}>
          <Space>
            Referral Dashboard <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default Referrals;
