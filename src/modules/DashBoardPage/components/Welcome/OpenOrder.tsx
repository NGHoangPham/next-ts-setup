import { FC, useState } from 'react';
import styles from './OpenOrder.module.css';
import { Button, Space } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Surface } from 'components/Surface';
import { FilterGroup } from 'components/FilterGroup';
import { OpenOrder as OpenOrders } from 'components/OrderTable';
import { routes } from 'types/routes';
import { Avatar } from 'components/Avatar';
import Convert from 'assets/images/convert.png';
import { useRouter } from 'next/router';

type IFilterType = 'all' | 'spot' | 'margin';
const OpenOrder: FC = () => {
  const router = useRouter();
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const onClickSeeAll = () => {
    router.push(routes.history);
  };

  return (
    <Surface filled className={styles.root}>
      <div className="f-between">
        <div className="bold default">OPEN ORDERS</div>
        <Space align="center" size={20}>
          <FilterGroup
            datas={[
              { label: 'All', value: 'all' },
              { label: 'Spot', value: 'spot' },
              { label: 'Margin', value: 'margin' },
            ]}
            value={filterType}
            filled
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          />
          <Avatar type="secondary" size={25} src={Convert} className={styles.iconConvert} />
        </Space>
      </div>
      <div className="divider-x my-8" />

      <OpenOrders historyType={0} />

      <div className="f-end ">
        <Button size="middle" type="text" className="right" onClick={() => onClickSeeAll()}>
          <Space>
            See All <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default OpenOrder;
