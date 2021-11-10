import { FC } from 'react';
import styles from './PriceCharts.module.css';
import { Row, Col } from 'antd';
import { CoinCard } from 'components/CoinCard';
import { useMarketGroupQuery } from 'api/market';
import { MarketGroupItem } from 'api/market/types';
interface PriceChartsProps {
  type?: 'all' | 'gainer' | 'loser';
}

const normalizeData = (data: MarketGroupItem[] | undefined, type: PriceChartsProps['type']) => {
  if (type === 'gainer') {
    return data?.filter((item) => item.moneyType === 'USDT' && parseFloat(item.dailyPriceChangePercent) >= 0);
  } else if (type === 'loser') {
    return data?.filter((item) => item.moneyType === 'USDT' && parseFloat(item.dailyPriceChangePercent) < 0);
  }
  return data?.filter((item) => item.moneyType === 'USDT');
};

export const PriceCharts: FC<PriceChartsProps> = ({ type = 'all' }) => {
  const { data } = useMarketGroupQuery({
    refetchInterval: 10000,
  });

  return (
    <section className="container">
      <Row gutter={[17, 25]} justify="center" align="middle" className={styles.root}>
        {normalizeData(data, type)?.map((coin, index) => (
          <Col key={index} sm={24} md={12} lg={6}>
            <CoinCard coin={coin} />
          </Col>
        ))}
      </Row>
    </section>
  );
};
