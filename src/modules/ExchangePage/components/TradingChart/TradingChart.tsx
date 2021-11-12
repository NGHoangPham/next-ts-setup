import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import { Surface } from 'components/Surface';
import styles from './TradingChart.module.css';
import { Row, Col, Dropdown, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faDotCircle,
  faChevronDown,
  faSortUp,
  faSortDown,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import ChartImg from './img/Chart.png';
import PairSelector from './PairSelector';
import { useTranslation } from 'next-i18next';
import { useAppSelector, useAppDispatch } from 'hooks';
import { setFullscreen } from 'store/ducks/system/slice';
import { nDecimalFormat, nDecimalFormatNoZero } from 'utils/number';
const TVChartContainer = dynamic(() => import('TVChartContainer'), { ssr: false });

interface TradingChartProps {
  convertData: any[];
}

const TradingChart: React.FC<TradingChartProps> = ({ convertData }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [activeInterval, setActiveInterval] = useState({
    text: '1h',
    resolution: '60',
  });
  const [headerData, setHeaderData] = useState<any>(null);

  const { currentPair, fullscreen, language } = useAppSelector((state) => state.system.exchange);
  const { listPairValue, currentPairValue } = useAppSelector((state) => state.exchange);

  const lastPrice = useMemo(() => {
    return headerData?.last ? nDecimalFormat(headerData.last, currentPairValue?.[3] ?? 2) : '__';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  const lastPriceUsd = useMemo(() => {
    return `$${headerData?.last ? nDecimalFormat(headerData.last, 2) : '__'}`;
  }, [headerData]);
  const dayChangePec = useMemo(() => {
    return (headerData?.dchange_pec ? Math.abs(headerData.dchange_pec).toFixed(2) : '__') + ' %';
  }, [headerData]);
  const dayChange = useMemo(() => {
    return headerData?.dchange ? nDecimalFormat(headerData.dchange, currentPairValue?.[3] ?? 2) : '__';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  const dayHigh = useMemo(() => {
    return headerData?.high ? nDecimalFormat(headerData.high, currentPairValue?.[3] ?? 2) : '__';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  const dayLow = useMemo(() => {
    return headerData?.low ? nDecimalFormat(headerData.low, currentPairValue?.[3] ?? 2) : '__';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  const dayVolumn = useMemo(() => {
    let rs = '';
    if (headerData?.vol) {
      let vol = Number(headerData.vol);
      if (vol > 1000000) {
        vol = vol / 1000000;
        rs += ' M';
      }
      rs = nDecimalFormatNoZero('' + vol, currentPairValue?.[3] ?? 2, 2) + rs;
    } else {
      rs = '__';
    }
    return rs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  const intervals = [
    { text: '1m', resolution: '1' },
    { text: '5m', resolution: '5' },
    { text: '15m', resolution: '15' },
    { text: '30m', resolution: '30' },
    { text: '1h', resolution: '60' },
    { text: '2h', resolution: '120' },
    { text: '4h', resolution: '240' },
    { text: '6h', resolution: '360' },
    { text: '12h', resolution: '720' },
    { text: '1d', resolution: '1D' },
    { text: '2d', resolution: '2D' },
    { text: '1w', resolution: '1W' },
  ];

  const resolutionOverlay = (
    <Menu>
      {intervals.map((interval) => (
        <Menu.Item
          key={interval.text}
          onClick={() => {
            setActiveInterval(interval);
          }}
        >
          {interval.text}
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    let headerData = null;
    if (listPairValue.length > 0) {
      headerData = listPairValue.find((listPairValue_item: any) => listPairValue_item.pair === currentPair);
    }
    setHeaderData(headerData);
  }, [listPairValue, currentPair]);

  return (
    <Surface className={clsx(styles.root, fullscreen ? styles.fullscreen : null)}>
      <div className={styles.header}>
        <Row gutter={[15, 15]} wrap={false}>
          <Col flex="auto">
            <Row gutter={[10, 10]} align="middle">
              <Col flex="none">
                <PairSelector convertData={convertData} />
              </Col>
              <Col flex="none">
                <div className={styles.currentWrap}>
                  <span className={clsx(styles.textBlock, styles.textStrong)}>{lastPrice}</span>
                  <span className={clsx(styles.textBlock, styles.textSmall)}>{lastPriceUsd}</span>
                </div>
              </Col>
              <Col flex="none">
                <div className={styles.changeWrap}>
                  <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>
                    {t('exchange.trading_chart.24h_change')}
                  </span>
                  <span
                    className={clsx(
                      styles.textBlock,
                      styles.textSmall,
                      !headerData || headerData.dchange_pec < 0 ? styles.textDanger : styles.textSuccess
                    )}
                  >
                    <span>{dayChange}</span>
                    <span className={styles.percentage}>
                      <FontAwesomeIcon
                        className={styles.sortIcon}
                        icon={!headerData || headerData.dchange_pec < 0 ? faSortDown : faSortUp}
                      />{' '}
                      {dayChangePec}
                    </span>
                  </span>
                </div>
              </Col>
              <Col flex="none">
                <div className={styles.highWrap}>
                  <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>
                    {t('exchange.trading_chart.24h_high')}
                  </span>
                  <span className={clsx(styles.textBlock, styles.textSmall)}>{dayHigh}</span>
                </div>
              </Col>
              <Col flex="none">
                <div className={styles.lowWrap}>
                  <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>
                    {t('exchange.trading_chart.24h_low')}
                  </span>
                  <span className={clsx(styles.textBlock, styles.textSmall)}>{dayLow}</span>
                </div>
              </Col>
              <Col flex="none">
                <div className={styles.volumnWrap}>
                  <span className={clsx(styles.textBlock, styles.textSmall, styles.textDark)}>
                    {t('exchange.trading_chart.24h_volumn')}
                  </span>
                  <span className={clsx(styles.textBlock, styles.textSmall)}>{dayVolumn}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col flex="none" className={styles.rightWrap}>
            <button
              type="button"
              className={styles.fullChartButton}
              onClick={(e: any) => {
                e.preventDefault();
                dispatch(setFullscreen(!fullscreen));
              }}
            >
              <img alt="chart" src={ChartImg.src} />
            </button>
            <div className={styles.actionWrap}>
              <div>
                <FontAwesomeIcon className={styles.actionIcon} icon={faTimesCircle} />
                <FontAwesomeIcon className={styles.actionIcon} icon={faSyncAlt} />
                <FontAwesomeIcon className={styles.actionIcon} icon={faDotCircle} />
              </div>
              <span className={styles.dropdown}>
                <Dropdown overlay={resolutionOverlay}>
                  <span>
                    <span className={styles.dropdownLabel}>{activeInterval.text}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </span>
                </Dropdown>
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.chartWrap}>
        <TVChartContainer symbol={currentPair} interval={activeInterval.resolution} locale={language} />
      </div>
    </Surface>
  );
};

export default TradingChart;
