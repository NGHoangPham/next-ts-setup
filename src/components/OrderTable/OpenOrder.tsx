import { FC, useEffect, useMemo, useState } from 'react';
import { Button as ButtonAntd, message, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { nDecimalFormat } from 'utils/number';
import { Button } from 'components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './OrderTable.module.css';
import { Avatar } from 'components/Avatar';
import { ColumnsType } from 'antd/lib/table';
import { currencyImgs } from 'assets/images/currency';
import { cancelAllOrder, cancelOrder } from 'api/history';
import { getAuthToken } from 'api/auth_token';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import { isServer, WEB_SOCKET_URL } from 'utils/constant';
import { take } from 'lodash';
import {
  ORDER_CANCELED,
  ORDER_COMPLETE,
  ORDER_ID,
  ORDER_LIMIT_PRICE,
  ORDER_NUMBER_GET,
  ORDER_PAIR_NAME,
  ORDER_PRICE,
  ORDER_STATUS,
  ORDER_TIME,
  ORDER_TOTAL,
  ORDER_TYPE,
} from './constant';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';

const getColumns = (handleCancelAll: Function, handleCancelOrder: Function, t: Function): ColumnsType<any> => [
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
    render(value) {
      return value === '0' ? '--' : nDecimalFormat(value, 2);
    },
  },
  {
    title: t('historypage.columns.price'),
    key: 'price',
    dataIndex: ORDER_PRICE,
    sorter: (a: any, b: any) => Math.abs(parseFloat(a[ORDER_PRICE])) - Math.abs(parseFloat(b[ORDER_PRICE])),
    showSorterTooltip: false,
    render(value, record) {
      return record[ORDER_TYPE] === 'MARKET' ? 'Market Price' : nDecimalFormat(value, 2).split('-');
    },
  },
  {
    title: t('historypage.columns.amount'),
    key: 'amount',
    dataIndex: ORDER_TOTAL,
    sorter: (a: any, b: any) => parseFloat(a[ORDER_TOTAL]) - parseFloat(b[ORDER_TOTAL]),
    showSorterTooltip: false,
    render(amount) {
      return nDecimalFormat(amount, 8);
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
    render(value, record: any) {
      const pairSplit = record[1].split('_');
      const total = (Math.abs(parseFloat(record[ORDER_PRICE])) * parseFloat(record[ORDER_TOTAL])).toFixed(2);
      return value === 'MARKET' ? 'Market Price' : nDecimalFormat(`${total}`, 2) + ` ${pairSplit[1]}`;
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

interface TOpenOrder {
  historyType: number;
}

export const OpenOrder: FC<TOpenOrder> = ({ historyType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [websocket, setSocket] = useState<any>();
  const [isSocketReady, setSocketReady] = useState<boolean>(false);
  const [isLoadingSocket, setLoadingSocket] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<Record<string, string>>();
  const [listOrders, setOrders] = useState<string[]>([]);
  const [listOrderDashboard, setOrderDashboard] = useState<string[]>([]);
  const isDashboard = useMemo(() => router.pathname.includes('/dashboard'), [router.pathname]);
  const { user } = useUser();
  useEffect(() => {
    if (!websocket && !isServer()) {
      setSocket(
        window.WebSocket ? new window.WebSocket(WEB_SOCKET_URL) : new (window as any).MozWebSocket(WEB_SOCKET_URL)
      );
      setLoadingSocket(true);
    }
    return () => {
      if (websocket) websocket.close();
    };
  }, [websocket]);

  if (websocket) {
    websocket.onmessage = (response: any) => {
      handleEventSocket(response.data);
    };
    websocket.onopen = () => {
      setSocketReady(true);
    };
  }

  useEffect(() => {
    if (isSocketReady) {
      handleSocketOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketReady]);
  useEffect(() => {
    if (isDashboard && listOrders) {
      setOrderDashboard(take(listOrders, 5));
    }
  }, [isDashboard, listOrders]);

  const sendMsg = (msg: string) => websocket.send(msg);

  useEffect(() => {
    if (authToken) {
      const authTokenMsg = `{"event":"loginToken","token":"${authToken['auth-token']}"}`;
      sendMsg(authTokenMsg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const { mutate: mutateAuthToken } = useMutation(getAuthToken, {
    onSuccess: (data) => {
      setAuthToken(data);
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
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
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const handleSocketOpen = async () => {
    //Check token localStorage
    if (user) {
      try {
        //get authToken
        mutateAuthToken();
      } catch (error) {
        message.error('Error');
      }
    }
  };

  const handleEventSocket = (data: any) => {
    if (data !== "{'ping':''}") {
      const convertData = JSON.parse(data);
      if (convertData.channel && convertData.channel === 'auth-orders') {
        handleDataOrder(convertData);
      }
      if (convertData.event && convertData.event === 'loginToken') {
        const authOrderMsg = `{"event":"subscribe", "channel":"auth-orders", "pageSize": 5,"pageIndex": 1}`;
        sendMsg(authOrderMsg);
      }
    }
  };
  const handleDataOrder = (convertData: any) => {
    let orders: string[] = [...listOrders];
    if (orders.length > 0) {
      convertData.data.forEach((item: any) => {
        const orderExist = orders.find((i) => i[ORDER_ID] === item[ORDER_ID]);
        if (orderExist !== undefined) {
          if (item[ORDER_STATUS] === ORDER_CANCELED || item[ORDER_STATUS] === ORDER_COMPLETE) {
            orders = orders.filter((i) => i[0] !== item[0]);
          } else {
            let index = 0;
            orders.forEach((i, key) => {
              if (i[ORDER_ID] === item[ORDER_ID]) {
                index = key;
              }
            });
            orders[index] = item;
          }
        } else if (!orderExist && item[ORDER_STATUS] !== ORDER_CANCELED && item[ORDER_STATUS] !== ORDER_COMPLETE) {
          orders.unshift(item);
        }
      });
    } else {
      convertData.data.forEach((item: any) => {
        if (item[ORDER_STATUS] !== ORDER_CANCELED && item[ORDER_STATUS] !== ORDER_COMPLETE) {
          orders.push(item);
        }
      });
    }
    setOrders(orders);
    setLoadingSocket(false);
  };

  const convertListOrders = useMemo(
    () =>
      listOrders.filter((item: any) =>
        historyType === 1
          ? parseFloat(item[ORDER_PRICE]) >= 0 && !item[ORDER_PRICE].includes('-')
          : !(parseFloat(item[ORDER_PRICE]) >= 0 && !item[ORDER_PRICE].includes('-'))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historyType]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => getColumns(handleCancelAll, handleCancelOrder, t), []);

  return (
    <div>
      <div className={styles.table}>
        {listOrderDashboard.length === 0 ? (
          <Table
            dataSource={historyType !== 0 ? convertListOrders : listOrders}
            rowKey="0"
            columns={columns}
            size="small"
            loading={isLoadingSocket}
            scroll={{ x: true }}
          />
        ) : (
          <Table
            dataSource={listOrderDashboard}
            rowKey="0"
            columns={columns}
            size="small"
            pagination={false}
            loading={isLoadingSocket}
            scroll={{ x: true }}
          />
        )}
      </div>
      <div></div>
    </div>
  );
};
