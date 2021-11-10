import { FC } from 'react';
import styles from './OrderTable.module.css';
import { Space } from 'antd';
import { useTranslation } from 'next-i18next';
import Convert from 'assets/images/convert.png';

import { Surface } from 'components/Surface';
import { FilterGroup } from 'components/FilterGroup';
import { Button } from 'components/Button';
import { OpenOrder, OrderHistory, TradeHistory } from 'components/OrderTable';
import { Avatar } from 'components/Avatar';
import clsx from 'clsx';
interface TOrderTable {
  onChangeFilter: (e: any) => void;
  filterType: string;
  onChangePage: (page: number) => void;
  historyType: number;
}

export const OrderTable: FC<TOrderTable> = ({ onChangeFilter, filterType, onChangePage, historyType }) => {
  const { t } = useTranslation();

  return (
    <Surface filled className={styles.root}>
      <div className="f-between">
        <div className="bold default">{t('historypage.table.title')}</div>
        <Space align="center" size={20}>
          <FilterGroup
            datas={[
              { label: t('historypage.table.openOrders'), value: 'openOrders' },
              {
                label: t('historypage.table.orderHistory'),
                value: 'orderHistory',
              },
              {
                label: t('historypage.table.tradeHistory'),
                value: 'tradeHistory',
              },
            ]}
            value={filterType}
            filled
            onChange={(e) => onChangeFilter(e)}
            className={clsx(styles.filerGroup, 'center')}
          />
          <Button size="small" className={styles.btnExchange}>
            <Avatar type="secondary" size={25} src={Convert} className={styles.iconConvert} />
          </Button>
        </Space>
      </div>
      <div className="divider-x my-8" />
      {filterType === 'openOrders' ? (
        <OpenOrder historyType={historyType} />
      ) : filterType === 'orderHistory' ? (
        <OrderHistory onChangePage={onChangePage} />
      ) : (
        <TradeHistory onChangePage={onChangePage} />
      )}
    </Surface>
  );
};
