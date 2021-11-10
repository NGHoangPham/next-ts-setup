import { FC, useState } from 'react';
import { Typography } from 'antd';
import { Space } from 'antd';
import styles from './styles.module.css';
import { FilterGroup } from 'components/FilterGroup';
import { PriceCharts } from 'components/PriceCharts';
import MainMarket from './components/MainMarket';
import { useTranslation } from 'next-i18next';

const MarketPage: FC = () => {
  const { t } = useTranslation();
  type IFilterType = 'all' | 'gainer' | 'loser';
  const [filterType, setFilterType] = useState<IFilterType>('all');

  return (
    <div className={styles.root}>
      <div className={styles.titleContent}>
        <Typography.Title level={1}>{t('marketpage.home.buy_crypto')}</Typography.Title>
        <Typography.Title level={5}>{t('marketpage.home.intro')}</Typography.Title>
        <div className={styles.filterWrapper}>
          <Space size={20}>
            <FilterGroup
              datas={[
                { label: t('marketpage.home.popular'), value: 'all' },
                { label: t('marketpage.home.top_gainer'), value: 'gainer' },
                { label: t('marketpage.home.top_loser'), value: 'loser' },
              ]}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
          </Space>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <PriceCharts type={filterType} />
      </div>
      <div className={styles.mainMarket}>
        <MainMarket />
      </div>
    </div>
  );
};

export default MarketPage;
