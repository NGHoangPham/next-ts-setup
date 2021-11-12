import { FC } from 'react';
import { Button as ButtonAntd, message, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { nDecimalFormat } from 'utils/number';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './OrdersHistory.module.css';
import { Avatar } from 'components/Avatar';
import { ColumnsType } from 'antd/lib/table';
import { currencyImgs } from 'assets/images/currency';
import { cancelAllOrder, cancelOrder } from 'api/history';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import {
  ORDER_LIMIT_PRICE,
  ORDER_NUMBER_GET,
  ORDER_PAIR_NAME,
  ORDER_PRICE,
  ORDER_TIME,
  ORDER_TOTAL,
  ORDER_TYPE,
} from './constant';
import { useWalletQuery } from 'api/wallet';
import { useUser } from '@auth0/nextjs-auth0';

interface TOpenOrder {
  openOrdersList: any;
  loadingOpenOrders: any;
  precisionsConfigs: any;
}

const OpenOrder: FC<TOpenOrder> = ({ openOrdersList, loadingOpenOrders, precisionsConfigs }) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const { refetch }: any = useWalletQuery({
    enabled: false,
  });

  const handleCancelAll = () => {
    mutateCancelAllOrder({ demoFlag: 1 });
  };

  const handleCancelOrder = (orderId: string) => {
    mutateCancelOrder({ order_id: orderId, type: 2 });
  };

  const { mutate: mutateCancelAllOrder } = useMutation(cancelAllOrder, {
    onSuccess: () => {
      message.success('Cancel Success!');
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateCancelOrder } = useMutation(cancelOrder, {
    onSuccess: () => {
      message.success('Cancel Success!');
      refetch();
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const fnAbsolute = (s: any) => {
    if (s.indexOf('-') === 0) {
      s = s.slice(1);
    }
    return s;
  };

  const columns: ColumnsType<any> = [
    {
      title: t('historypage.columns.date'),
      key: 'time',
      dataIndex: ORDER_TIME,
      sorter: (a: any, b: any) => a[ORDER_TIME] - b[ORDER_TIME],
      showSorterTooltip: false,
      render(value: any) {
        return <span>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
      },
    },
    {
      title: t('historypage.columns.pair'),
      key: 'pair',
      dataIndex: ORDER_PAIR_NAME,
      sorter: (a: any, b: any) => a[ORDER_PAIR_NAME].localeCompare(b[ORDER_PAIR_NAME]),
      showSorterTooltip: false,
      render(pairStr) {
        const pairSplit = pairStr.split('_');
        return (
          <Space>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[0]}</span>
            </Space>
            <span className="bold default">—</span>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[1]}</span>
            </Space>
          </Space>
        );
      },
    },
    {
      title: t('historypage.columns.type'),
      key: 'orderType',
      dataIndex: ORDER_TYPE,
      render(type) {
        return <span>{type}</span>;
      },
    },
    {
      title: t('historypage.columns.side'),
      key: 'side',
      dataIndex: ORDER_PRICE,
      render(side) {
        return <span className={side >= 0 ? 'success' : 'error'}>{side >= 0 ? 'Buy' : 'Sell'}</span>;
      },
    },
    {
      title: t('historypage.columns.stopPrice'),
      key: 'stopPrice',
      dataIndex: ORDER_LIMIT_PRICE,
      sorter: (a: any, b: any) => a[ORDER_LIMIT_PRICE] - b[ORDER_LIMIT_PRICE],
      showSorterTooltip: false,
      render(value, item) {
        const pairSplit = item?.pair?.split('_');
        return value === '0'
          ? '--'
          : nDecimalFormat(fnAbsolute(value), precisionsConfigs?.[item[1]]?.money ?? 8) +
              (pairSplit ? ` ${pairSplit[1]}` : '');
      },
    },
    {
      title: t('historypage.columns.price'),
      key: 'price',
      dataIndex: ORDER_PRICE,
      sorter: (a: any, b: any) => Math.abs(parseFloat(a[ORDER_PRICE])) - Math.abs(parseFloat(b[ORDER_PRICE])),
      showSorterTooltip: false,
      render(value, item) {
        const pairSplit = item?.pair?.split('_');
        return item?.[ORDER_TYPE] === 'MARKET'
          ? 'Market Price'
          : nDecimalFormat(fnAbsolute(value), precisionsConfigs?.[item[1]]?.money ?? 8).split('-') +
              (pairSplit ? ` ${pairSplit[1]}` : '');
      },
    },
    {
      title: t('historypage.columns.amount'),
      key: 'amount',
      dataIndex: ORDER_TOTAL,
      sorter: (a: any, b: any) => parseFloat(a[ORDER_TOTAL]) - parseFloat(b[ORDER_TOTAL]),
      showSorterTooltip: false,
      render(amount, item) {
        const pairSplit = item?.pair?.split('_');
        return (
          nDecimalFormat(fnAbsolute(amount), precisionsConfigs?.[item[1]]?.coin ?? 8) +
          (pairSplit ? ` ${pairSplit[0]}` : '')
        );
      },
    },
    {
      title: t('historypage.columns.total'),
      key: 'total',
      dataIndex: 7,
      sorter: (a: any, b: any) =>
        Math.abs(parseFloat(a[ORDER_PRICE])) * parseFloat(a[ORDER_TOTAL]) -
        Math.abs(parseFloat(b[ORDER_PRICE])) * parseFloat(b[ORDER_TOTAL]),
      showSorterTooltip: false,
      render(value, item: any) {
        const pairSplit = item?.[1]?.split('_');
        const total = (Math.abs(parseFloat(item[ORDER_PRICE])) * parseFloat(item[ORDER_TOTAL])).toFixed(2);
        return value === 'MARKET'
          ? 'Market Price'
          : nDecimalFormat(fnAbsolute(`${total}`), precisionsConfigs?.[item[1]]?.money ?? 8) +
              (pairSplit ? ` ${pairSplit[1]}` : '');
      },
    },
    {
      title: t('historypage.columns.filled'),
      key: 'tradeAmount',
      dataIndex: ORDER_NUMBER_GET,
      sorter: (a: any, b: any) =>
        (parseFloat(a[ORDER_NUMBER_GET]) / parseFloat(a[ORDER_TOTAL])) * 100 -
        (parseFloat(b[ORDER_NUMBER_GET]) / parseFloat(b[ORDER_TOTAL])) * 100,
      showSorterTooltip: false,
      render(tradeAmount, record: any) {
        return (
          <span className="light">
            {((parseFloat(tradeAmount) / parseFloat(record[ORDER_TOTAL])) * 100).toFixed(2) + '%'}
          </span>
        );
      },
    },
    {
      title: (
        <Button className={styles.btnCancel}>
          <Popconfirm
            title={t('historypage.columns.cancelAllOrder')}
            onConfirm={() => handleCancelAll()}
            className={styles.popconfirm}
          >
            <span>{t('historypage.columns.cancelAll')}</span>
            <FontAwesomeIcon color="#788686" icon={faTimesCircle} />
          </Popconfirm>
        </Button>
      ),
      key: 'state',
      align: 'right',
      width: 105,
      render(record) {
        return (
          <ButtonAntd className="light" size="small" type="text">
            <Space align="center">
              <Popconfirm
                title={t('historypage.columns.cancelOrder')}
                onConfirm={() => handleCancelOrder(record[0])}
                className={styles.popconfirm}
              >
                <span>{t('historypage.columns.cancel')}</span>
                <FontAwesomeIcon color="#788686" icon={faTimes} />
              </Popconfirm>
            </Space>
          </ButtonAntd>
        );
      },
    },
  ];

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={openOrdersList}
          rowKey="0"
          columns={columns}
          loading={user ? loadingOpenOrders : false}
          size="small"
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
          }}
          locale={{
            emptyText: user ? undefined : (
              <a href="/api/auth/login">
                <Button type="primary" className={styles.authButton}>
                  Login to trade
                </Button>
              </a>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default OpenOrder;
