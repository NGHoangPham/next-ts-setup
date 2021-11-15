/* eslint-disable react-hooks/rules-of-hooks */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMarketGroupQuery } from 'api/market';
import { MarketGroupItem } from 'api/market/types';
import { currencyImgs } from 'assets/images/currency';
import clsx from 'clsx';
import { Avatar } from 'components/Avatar';
import { Button } from 'components/Button';
import { PercentIndicator } from 'components/Statistic';
import { TFunction, useTranslation } from 'next-i18next';
import { routes } from 'types/routes';
import { FC, useMemo, useState } from 'react';
import { nFormatter, nDecimalFormat } from 'utils/number';
import styles from './BuyTable.module.css';
import commonStyles from './common.module.css';
import Link from 'next/link';

const getColumns = (t: TFunction): ColumnsType<MarketGroupItem> => [
  {
    key: 'pair',
    dataIndex: 'pair',
    render(pair: MarketGroupItem['pair']) {
      return (
        <Space align="center">
          <Avatar type="secondary" src={currencyImgs[pair] || currencyImgs.GENERIC} size={22} />
          <span className={clsx(styles.rowValue, styles.rowPair)}>{pair}</span>
        </Space>
      );
    },
  },
  {
    key: 'lastTradePrice',
    dataIndex: 'lastTradePrice',
    render(lastTradePrice: MarketGroupItem['lastTradePrice']) {
      return (
        <span className={styles.rowValue_price}>
          <span className={styles.rowValue__priceUnit}>$</span>
          <span className={styles.rowValue}>{nDecimalFormat(lastTradePrice, 2) || '0'}</span>
        </span>
      );
    },
  },
  {
    key: 'dailyPriceChangePercent',
    dataIndex: 'dailyPriceChangePercent',
    render(dailyPriceChangePercent: MarketGroupItem['dailyPriceChangePercent']) {
      return <PercentIndicator transparent value={dailyPriceChangePercent || '0.00%'} />;
    },
  },
  {
    key: 'totalVolume',
    render({ totalVolume }: MarketGroupItem) {
      return (
        <div>
          <span className={styles.rowValue__volumeTimestamp}>24h</span>
          <br />
          <span className={styles.rowValue__volumeValue}>Vol. $ {nFormatter(parseInt(totalVolume), 2)}</span>
        </div>
      );
    },
  },
  {
    key: 'actions',
    align: 'right',
    colSpan: 5,
    render() {
      return (
        <Button type="info">
          <Link href={routes.buy}>{t('homepage.buy.buy_now')}</Link>
        </Button>
      );
    },
  },
];

export const BuyTable: FC = () => {
  const { t } = useTranslation();
  const { data, status } = useMarketGroupQuery({
    refetchInterval: 10000,
  });
  const [showAll, setShowAll] = useState(false);

  const showAllAction = () => {
    setShowAll(true);
  };

  const columns = useMemo(() => getColumns(t), [t]);
  return (
    <section className={clsx(commonStyles.root, styles.root)}>
      <div className={styles.titles}>
        <h2 className={commonStyles.title}>{t('homepage.buy.title')}</h2>
        <p className={commonStyles.subtitle}>{t('homepage.buy.subtitle')}</p>
      </div>
      <div className={styles.table}>
        <Table
          loading={status === 'loading'}
          dataSource={
            // FIXME: Temp data
            data
              ?.filter((d) => d.moneyType === 'USDT')
              .slice(0, showAll ? data.length : 4)
              .map((value) => ({
                ...value,
                key: value.pair,
                pair: value.pair.split('_')[0],
              })) || []
          }
          columns={columns}
          pagination={false}
        />
      </div>
      {!showAll && (
        <Button type="primary" onClick={showAllAction}>
          {t('homepage.buy.list_all')}
          <FontAwesomeIcon className={styles.btnIcon} icon={faArrowRight} />
        </Button>
      )}
    </section>
  );
};
