/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { message, Space } from 'antd';
import { FilterGroup } from 'components/FilterGroup';
import { Surface } from 'components/Surface';
import { useAppDispatch } from 'hooks';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation } from 'react-query';
import styles from './OrdersHistory.module.css';
import { searchOrderHistory, searchTradeHistory, TRequestHistory } from 'api/history';
import { setOrderHistory, setTradeHistory, setPageInfo, setIsLoadingHistory } from 'store/ducks/history/slice';
import { TError } from 'api/types';
import clsx from 'clsx';
import OpenOrder from './OpenOrder';
import OrderHistory from './OrderHistory';
import TradeHistory from './TradeHistory';
import { usePairListQuery } from 'api/exchange';

type TFilterType = 'openOrders' | 'orderHistory' | 'tradeHistory';

interface OrdersHistoryProps {
  openOrdersList: any;
  loadingOpenOrders: any;
}

const OrdersHistory: FC<OrdersHistoryProps> = memo(({ openOrdersList, loadingOpenOrders }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [coinPair1, setCoinPair1] = useState<string>('');
  const [coinPair2, setCoinPair2] = useState<string>('');
  const [dateStart, setDateStart] = useState<number>(0);
  const [dateEnd, setDateEnd] = useState<number>(0);
  const [precisionsConfigs, setPrecisionsConfigs] = useState<any>({});
  const [filterType, setFilterType] = useState<TFilterType>('openOrders');

  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });

  const { mutate: mutateOrderHistory, status: sttOrderHistory } = useMutation(searchOrderHistory, {
    onSuccess: (data) => {
      if (sttOrderHistory) {
        dispatch(setOrderHistory(data.orders));
        dispatch(setPageInfo(data.page));
      }
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateTradeHistory, status: sttTradeHistory } = useMutation(searchTradeHistory, {
    onSuccess: (data) => {
      if (sttTradeHistory) {
        dispatch(setTradeHistory(data.orders));
        dispatch(setPageInfo(data.page));
      }
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const changeFilter = useMemo(
    () => (e: any) => {
      const filter = e.target.value;
      setFilterType(filter);
      setDateStart(0);
      setDateEnd(0);
      setCoinPair1('');
      setCoinPair2('');
      const data: TRequestHistory = {
        symbol: coinPair1.length === 0 || coinPair2.length === 0 ? '' : `${coinPair1}_${coinPair2}`,
        type: 0,
        state: '',
        start_time: dateStart,
        end_time: dateEnd,
        order_id: '',
        page: 1,
        page_size: 10,
      };
      if (filter === 'orderHistory') {
        mutateOrderHistory(data);
      } else if (filter === 'tradeHistory') {
        mutateTradeHistory(data);
      }
    },
    []
  );

  useEffect(() => {
    if (sttOrderHistory === 'loading' || sttTradeHistory === 'loading') dispatch(setIsLoadingHistory(true));
    else dispatch(setIsLoadingHistory(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sttOrderHistory, sttTradeHistory]);

  const requestData = (pageCurrent: number) => {
    const data: TRequestHistory = {
      symbol: coinPair1.length === 0 || coinPair2.length === 0 ? '' : `${coinPair1}_${coinPair2}`,
      type: 0,
      state: '',
      start_time: dateStart,
      end_time: dateEnd,
      order_id: '',
      page: pageCurrent,
      page_size: 10,
    };
    if (filterType === 'orderHistory') mutateOrderHistory(data);
    else if (filterType === 'tradeHistory') mutateTradeHistory(data);
  };

  const changePage = (page: number) => {
    requestData(page);
  };

  useEffect(() => {
    let precisions: any = {};
    if (pairList) {
      pairList.forEach((data: any) => {
        precisions[data[0]] = {
          coin: parseInt(data[2]),
          money: parseInt(data[3]),
        };
      });
      setPrecisionsConfigs(precisions);
    }
  }, [pairList]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainContainer}>
        <div>
          <Surface filled className={styles.root}>
            <div className="f-between">
              <Space align="center" size={20}>
                <FilterGroup
                  datas={[
                    {
                      label: t('historypage.table.openOrders'),
                      value: 'openOrders',
                    },
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
                  onChange={(e) => changeFilter(e)}
                  className={clsx(styles.filerGroup, 'center')}
                />
              </Space>
            </div>
            <div className="divider-x my-8" />
            {filterType === 'openOrders' ? (
              <OpenOrder
                openOrdersList={openOrdersList}
                loadingOpenOrders={loadingOpenOrders}
                precisionsConfigs={precisionsConfigs}
              />
            ) : filterType === 'orderHistory' ? (
              <OrderHistory onChangePage={changePage} precisionsConfigs={precisionsConfigs} />
            ) : (
              <TradeHistory onChangePage={changePage} precisionsConfigs={precisionsConfigs} />
            )}
          </Surface>
        </div>
      </div>
    </div>
  );
});

export default OrdersHistory;
