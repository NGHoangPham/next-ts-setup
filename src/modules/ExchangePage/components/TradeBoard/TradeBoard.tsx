import { FC, memo } from 'react';
import styles from './TradeBoard.module.css';
import { Surface } from 'components/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FilterGroup } from 'components/FilterGroup';
import { Space } from 'antd';
import { OrderBookTable } from './OrderBookTable';
import { TradesTable } from './TradesTable';

type IFilterType = 'orderBook' | 'trades';

interface TradeBoardProps {
  filterType: 'orderBook' | 'trades';
  setFilterType: (value: IFilterType) => void;
}

// eslint-disable-next-line react/display-name
export const TradeBoard: FC<TradeBoardProps> = memo(({ filterType, setFilterType }) => {
  return (
    <Surface className={styles.root}>
      <Space className={styles.header}>
        <Space size={20}>
          <FilterGroup
            filled
            className="tradeBoardFilter"
            datas={[
              { label: 'Order Book', value: 'orderBook' },
              { label: 'Trades', value: 'trades' },
            ]}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          />
        </Space>
        <div>
          <FontAwesomeIcon color="#788686" icon={faTimesCircle} className={styles.iconClose} />
          <FontAwesomeIcon color="#788686" icon={faDotCircle} />
        </div>
      </Space>

      {filterType === 'orderBook' ? <OrderBookTable /> : <TradesTable />}
    </Surface>
  );
});
