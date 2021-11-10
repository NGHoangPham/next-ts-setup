import { FC, useMemo, useState } from 'react';

import styles from './MainMarket.module.css';
import { Col, Form, Row, Table } from 'antd';
import { InputWithLabel } from 'components/Input';
import { FilterGroup } from 'components/FilterGroup';
import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { currencyFormatter } from 'utils/currency';
import { Button } from 'components/Button';
import { PercentIndicator } from 'components/Statistic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MarketGroupItem } from 'api/market/types';
import { useTranslation } from 'next-i18next';
interface IOpenOrder {
  Coin: string;
  lastPrice: string;
  change24h: string;
  hight24h: number;
  low24h: number;
  marketCap: number;
  volume24h: number;
}
const getColumns = (t: Function): ColumnsType<IOpenOrder> => [
  {
    title: t('marketpage.marketTable.coin'),
    key: 'Coin',
    dataIndex: 'Coin',
  },
  {
    title: t('marketpage.marketTable.lastPrice'),
    key: 'lastPrice',
    dataIndex: 'lastPrice',
  },
  {
    title: t('marketpage.marketTable.24h_change'),
    key: 'change24h',
    dataIndex: 'change24h',
    render(dailyPriceChangePercent: MarketGroupItem['dailyPriceChangePercent']) {
      return <PercentIndicator transparent value={dailyPriceChangePercent} />;
    },
  },
  {
    title: t('marketpage.marketTable.24h_hight'),
    key: 'hight24h',
    dataIndex: 'hight24h',
  },
  {
    title: t('marketpage.marketTable.24h_low'),
    key: 'low24h',
    dataIndex: 'low24h',
    render(price) {
      return currencyFormatter(price);
    },
  },
  {
    title: t('marketpage.marketTable.market_cap'),
    key: 'marketCap',
    dataIndex: 'marketCap',
  },
  {
    title: t('marketpage.marketTable.24h_volume'),
    key: 'volume24h',
    dataIndex: 'volume24h',
  },
  {
    key: 'actions',
    align: 'right',
    colSpan: 5,
    render() {
      return (
        <Button type="blue" size="small">
          {t('marketpage.marketTable.trade')}
        </Button>
      );
    },
  },
  {
    key: 'actions',
    align: 'right',
    colSpan: 5,
    render() {
      return (
        <Button type="info" size="small">
          {t('marketpage.marketTable.buy')}
        </Button>
      );
    },
  },
];

const MainMarket: FC = () => {
  const { t } = useTranslation();
  type IFilterType = 'all' | 'spot' | 'margin';
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const datas: IOpenOrder[] = Array.from(Array(6).keys()).map((id) => ({
    id,
    Coin: 'BTC / USDC',
    lastPrice: '49,682.00 / $49,682.00',
    change24h: '12.5%',
    hight24h: 49682.0,
    low24h: 33295.02,
    marketCap: 1.034212,
    volume24h: 1.034212,
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => getColumns(t), []);

  return (
    <div>
      <Row gutter={[24, 0]} className={styles.introWrapper} justify="space-between">
        <Col lg={6}>
          <Form.Item>
            <InputWithLabel
              placeholder={t('marketpage.form.place_holder')}
              id="search"
              label={t('marketpage.form.search')}
              searchForm
            />
            <FontAwesomeIcon color="#788686" icon={faSearch} className={styles.searchIcon} size="lg" />
          </Form.Item>
        </Col>
        <Col lg={6.5}>
          <Space size={30}>
            <FilterGroup
              datas={[
                { label: t('marketpage.filter.all'), value: 'all' },
                {
                  label: t('marketpage.filter.watch'),
                  value: 'Your Watchlist',
                },
                {
                  label: t('marketpage.home.top_gainer'),
                  value: 'Top Gainers',
                },
                {
                  label: t('marketpage.home.top_loser'),
                  value: 'Top Losers',
                },
              ]}
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
              }}
            />
          </Space>
        </Col>
      </Row>
      <div className="divider-x my-8" />
      <div className={styles.table}>
        <Table columns={columns} dataSource={datas} rowKey="id" pagination={false} size="small" scroll={{ x: true }} />
      </div>
    </div>
  );
};

export default MainMarket;
