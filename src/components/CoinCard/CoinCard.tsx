import { CSSProperties, FC } from 'react';
import styles from './styles.module.css';
import { Space } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ApexOptions } from 'apexcharts';

import { Avatar } from 'components/Avatar';
import { currencyImgs } from 'assets/images/currency';
import { Surface } from 'components/Surface';
import clsx from 'clsx';
import { MarketGroupItem } from 'api/market/types';
import { nDecimalFormat, nFormatter } from 'utils/number';
import { PercentIndicator } from 'components/Statistic';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options: ApexOptions = {
  chart: {
    type: 'area',
    height: 68,
    background: 'transparent',
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  theme: {
    mode: 'dark',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '80%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    labels: {
      show: false,
    },
    tickAmount: 1,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  grid: {
    show: false,
  },
  tooltip: {
    x: {
      show: false,
    },
  },
};

enum chartStatus {
  up = 'up',
  down = 'down',
  stable = 'stable',
}

interface CoinCardProps {
  coin: MarketGroupItem;
  className?: string;
  style?: CSSProperties;
}

export const CoinCard: FC<CoinCardProps> = ({ className, style, coin }) => {
  const getCoin = {
    coinName() {
      return coin.pair.split('_')[0];
    },
    priceList() {
      return [{ name: '', data: coin.priceList }];
    },
    color() {
      switch (this.status()) {
        case chartStatus.up:
          return '#00FE9A';
        case chartStatus.down:
          return '#FF006A';
        case chartStatus.stable:
          return '#BFC1C3';
      }
    },
    style() {
      switch (this.status()) {
        case chartStatus.up:
          return styles.priceUp;
        case chartStatus.down:
          return styles.priceDown;
        case chartStatus.stable:
          return styles.priceStable;
      }
    },
    status() {
      const rate = parseFloat(this.dailyChangePercent());
      if (rate > 0) {
        return chartStatus.up;
      } else if (rate < 0) {
        return chartStatus.down;
      }
      return chartStatus.stable;
    },
    dailyChangePercent() {
      return coin?.dailyPriceChangePercent || '0%';
    },
    lastTradePrice() {
      return nDecimalFormat(coin?.lastTradePrice || '0');
    },
    totalVolume() {
      return nFormatter(parseFloat(coin?.totalVolume), 2);
    },
  };

  return (
    <div className={clsx(styles.root, className)} style={style}>
      <Surface borderMd className={styles.cardHead}>
        {/* Statictis Head */}
        <Space direction="vertical">
          <div>
            <Space align="center" size={8}>
              <Avatar type="secondary" src={currencyImgs[getCoin.coinName()] || currencyImgs.GENERIC} size={22} />
              <span className={styles.coinName}>{getCoin.coinName()}</span>
              <FontAwesomeIcon className={styles.arrowRight} icon={faArrowRight} color="#788686" />
            </Space>
          </div>
          <div>
            <span className={styles.timeName}>24h</span>
            <div className={styles.vol}>Vol. $ {getCoin.totalVolume()}</div>
          </div>
        </Space>

        {/* Chart */}
        <ReactApexChart
          className={styles.chart}
          options={{ ...options, colors: [getCoin.color()] }}
          series={getCoin.priceList()}
          type="area"
          height={100}
        />
      </Surface>
      {/* Statictis Bottom */}
      <Surface borderMd className={styles.cardBottom}>
        <Space className={clsx(styles.priceWrapper, getCoin.style(), styles.priceUp)}>
          <PercentIndicator value={getCoin.dailyChangePercent() === '0%' ? '0.00%' : getCoin.dailyChangePercent()} />
        </Space>

        <b className={styles.price}>
          <span className={styles.dollarMark}>$ </span>
          {getCoin.lastTradePrice()}
        </b>
      </Surface>
    </div>
  );
};
