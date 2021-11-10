import { FC, useEffect, useState } from 'react';
import styles from './AccountBalance.module.css';
import { Row, Col, Space, Button } from 'antd';
import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { currencyImgs } from 'assets/images/currency';
import { ApexOptions } from 'apexcharts';

import { Surface } from 'components/Surface';
import { PercentIndicator } from 'components/Statistic';
import { Avatar } from 'components/Avatar';

import DepositIcon from '../../assets/icon-deposit.png';
import WithdrawIcon from '../../assets/icon-withdraw.png';
import { useWalletQuery } from 'api/wallet';
import { useMarketGroupQuery } from 'api/market';
import { useAppSelector } from 'hooks';
import { WalletTableItem } from 'api/wallet/types';
import { MarketGroupItem } from 'api/market/types';
import { priceByCurrency } from 'utils/currency';
import { nDecimalFormat } from 'utils/number';
import { routes } from 'types/routes';
import { NextRouter, useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface THeadInfo {
  assessmentResult: string;
  totalNumber: string;
}
interface TCurrentPortfolio {
  router: NextRouter;
}

const HeadInfo: FC<THeadInfo> = ({ assessmentResult, totalNumber }) => {
  return (
    <div className={styles.balanceWrapper}>
      <Space direction="vertical" size={0}>
        <span className="secondary">Account balance:</span>
        <div className={styles.balanceTextWrapper}>
          <span className="text-28 bold">
            {totalNumber} <span className="medium text-26">BTC</span>
          </span>
          <p className="secondary text-20">
            {assessmentResult} <span className="text-18 secondary">USD</span>
          </p>
        </div>
      </Space>

      <Surface className={styles.pnlWrapper}>
        <div>
          <div className="secondary">Yesterday&apos;s PNL:</div>
          <span className="medium text-20">
            <span className="text-20">- $</span> 243.05
          </span>
          <span> USD</span>
        </div>
        <PercentIndicator value="-12.5%" />
      </Surface>
    </div>
  );
};

const DepositAndWithDraw: FC = () => {
  return (
    <Row gutter={32}>
      <Col span={12}>
        <div className={clsx(styles.card, styles.cardBalance)}>
          <img alt="deposit" src={DepositIcon.src} />
          <p className="secondary">Deposit</p>
        </div>
      </Col>
      <Col span={12}>
        <div className={clsx(styles.card, styles.cardBalance)}>
          <img alt="widraw" src={WithdrawIcon.src} />
          <p className="secondary">Withdraw</p>
        </div>
      </Col>
    </Row>
  );
};

const options: ApexOptions = {
  chart: {
    type: 'polarArea',
  },
  colors: ['#F7931A', '#627EEA', '#39A883'],
  fill: {
    opacity: 1,
  },
  labels: ['BTC', 'ETH', 'USDT'],
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0,
      },
      spokes: {
        strokeWidth: 0,
      },
    },
  },
};

const CurrentPortfolio: FC<TCurrentPortfolio> = ({ router }) => {
  const [datas] = useState([42, 47, 52]);

  return (
    <div>
      <p className="secondary">Current portfolio:</p>
      <div className={clsx(styles.card, styles.cardPortfolio)}>
        <ReactApexChart options={options} series={datas} type="polarArea" height={240} />
        <Space direction="vertical">
          <div className={styles.chartLabel}>
            <Avatar type="secondary" size={25} src={currencyImgs.GENERIC} />
            <div>0.045212</div>
            <div>25 %</div>
          </div>
          <div className={styles.chartLabel}>
            <Avatar type="secondary" size={25} src={currencyImgs.ETH} />
            <div>1.2312021</div>
            <div>12 %</div>
          </div>
          <div className={styles.chartLabel}>
            <Avatar type="secondary" size={25} src={currencyImgs.USDT} />
            <div>0.045212</div>
            <div>64 %</div>
          </div>
        </Space>
      </div>
      <div className="f-end -mr-15">
        <Button type="text" className="right" onClick={() => router.push(routes.wallet)}>
          <Space>
            Wallet <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </div>
  );
};

export const DISABLE_COIN = ['KUSD', 'IUSD', 'XEX'];
export const NUMBER_ROUND = 8;
export const HIDE_XEX_WALLET = 0;

const AccountBalance: FC = () => {
  const router = useRouter();
  const { data }: any = useWalletQuery();
  const { data: marketGroup } = useMarketGroupQuery({
    refetchInterval: 10000,
  });
  const { currentCurrency } = useAppSelector((state) => state.account);
  const assessment: string = (data && data.assessment) || '';
  const coins: WalletTableItem[] = (data && data.coin) || [];
  const marketList: MarketGroupItem[] = marketGroup || [];

  const [assessmentResult, setAssessment] = useState('');
  const [totalNumber, setTotalNumber] = useState('');

  useEffect(() => {
    const assessmentNumber = parseFloat(assessment) || 0;
    let xexAssessment: string | undefined = '0';
    if (HIDE_XEX_WALLET && coins) {
      xexAssessment = coins.find((el) => el.coinType === 'XEX')?.assessment;
    }
    const result: number = assessmentNumber - priceByCurrency(parseFloat(xexAssessment || '0'), currentCurrency.rate);
    setAssessment(`
        ~${JSON.parse(currentCurrency).symbol} ${!result ? '0.00' : nDecimalFormat(result.toString(), 2)}`);

    let btcPrice: number | undefined = 0;
    if (marketList.length > 0) {
      btcPrice = parseFloat(marketList.find((i) => i.pair.split('_')[0] === 'BTC')?.lastTradePrice || '0');
    }
    const totalResult: number = btcPrice ? (assessmentNumber - parseFloat(xexAssessment || '0')) / btcPrice : 0;
    setTotalNumber(`
        ${!totalResult ? '0.00' : nDecimalFormat(totalResult.toString(), 8)}
      `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, marketList]);

  return (
    <Surface borderMd className={styles.root}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <HeadInfo assessmentResult={assessmentResult} totalNumber={totalNumber} />
        </Col>
        <Col span={24}>
          <DepositAndWithDraw />
        </Col>
        <Col span={24}>
          <CurrentPortfolio router={router} />
        </Col>
      </Row>
    </Surface>
  );
};

export default AccountBalance;
