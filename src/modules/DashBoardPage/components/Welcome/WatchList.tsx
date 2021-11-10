import { FC } from 'react';
import styles from './WatchList.module.css';
import { Button, Space } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';
import { currencyImgs } from 'assets/images/currency';

import { Surface } from 'components/Surface';
import { Avatar } from 'components/Avatar';
import { PercentIndicator } from 'components/Statistic';
import { useState } from 'react';

import { nDecimalFormat } from 'utils/number';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';

interface ListItemProps {
  id?: number;
  coinName: string;
  price: number;
  percent: string;
  vol: number;
  onClick?: () => void;
}

const ListItem: FC<ListItemProps> = ({ coinName, ...props }) => (
  <li className={styles.listItem}>
    <Space align="center" size="small">
      <Avatar type="secondary" src={currencyImgs[coinName]} size={22} />
      <span>{coinName}</span>
    </Space>
    <Space size="small">
      <span className="text-18">$</span>
      <span className="text-18 bold">{nDecimalFormat(`${props.price}`)}</span>
    </Space>
    <PercentIndicator value={props.percent} />
    <div>
      <span className="text-12 secondary">24h</span>
      <br />
      <span className="text-14 light ">Vol. $ {props.vol}M</span>
    </div>

    <Button
      onClick={props.onClick}
      shape="circle"
      type="text"
      icon={<FontAwesomeIcon icon={faChevronRight} color="#ffffff" />}
    />
  </li>
);

const WatchList: FC = () => {
  const router = useRouter();
  const [datas] = useState(
    Array.from(Array(4).keys()).map((id) => ({
      id,
      coinName: 'BTC',
      price: 49682.0,
      percent: '12.5%',
      vol: 478,
    }))
  );

  return (
    <Surface borderMd className={styles.root}>
      <div className="f-between">
        <div className="bold default">WATCHLIST</div>
        <FontAwesomeIcon icon={faEye} color="#788686" size="lg" />
      </div>
      <div className="divider-x my-8" />

      <ul className={styles.listWrapper}>
        {datas.map((item) => (
          <ListItem {...item} key={item.id} />
        ))}
      </ul>

      <div className="f-end -mr-15">
        <Button size="middle" type="text" className="right" onClick={() => router.push(routes.market)}>
          <Space>
            Market <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default WatchList;
