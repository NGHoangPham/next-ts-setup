import { DatePicker } from 'components/DatePicker';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './MainContent.module.css';
import { message, Space, Button as AntdButton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { OrderTable } from 'components/OrderTable';
import { SelectWithLabel, Option } from 'components/Select/SelectWithLabel';
import { searchOrderHistory, searchTradeHistory, TRequestHistory, usePairAllQuery } from 'api/history';
import remove from 'lodash/remove';
import { useTranslation } from 'next-i18next';
import { Button } from 'components/Button';
import { useMutation } from 'react-query';
import { TError } from 'api/types';

import { setOrderHistory, setTradeHistory, setPageInfo, setIsLoadingHistory } from 'store/ducks/history/slice';
import { useAppDispatch } from 'hooks';

type TFilterType = 'openOrders' | 'orderHistory' | 'tradeHistory';

const MainContent: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data: pairAll } = usePairAllQuery();

  const [listCoinHead, setListCoinHead] = useState<string[]>([]);
  const [listCoinLast, setListCoinLast] = useState<string[]>([]);
  const [coinPair1, setCoinPair1] = useState<string>('');
  const [coinPair2, setCoinPair2] = useState<string>('');

  const [historyType, setHistoryType] = useState<number>(0);
  const [dateStart, setDateStart] = useState<number>(0);
  const [dateEnd, setDateEnd] = useState<number>(0);
  const [filterType, setFilterType] = useState<TFilterType>('openOrders');

  const dataBbPairList = pairAll?.bbPairList;

  useEffect(() => {
    if (dataBbPairList) {
      const bbPairList = dataBbPairList;
      let listCoinFrom: string[] = [];
      let listCoinTo: string[] = [];
      let listFilterCoinFrom: Record<string, any> = [];
      let listFilterCoinTo: Record<string, any> = [];
      bbPairList.forEach((item: any) => {
        const first = item.name.split('_')[0],
          second = item.name.split('_')[1];
        listCoinFrom.push(first);
        listCoinTo.push(second);
        if (!listFilterCoinFrom[first]) {
          listFilterCoinFrom[first] = [];
        }
        listFilterCoinFrom[first].push(second);
        if (!listFilterCoinTo[second]) {
          listFilterCoinTo[second] = [];
        }
        listFilterCoinTo[second].push(first);
      });

      listCoinFrom = Array.from(new Set(listCoinFrom));
      listCoinTo = Array.from(new Set(listCoinTo));

      if (coinPair1.length > 0 && coinPair2 !== coinPair1) {
        remove(listCoinTo, (item: any) => {
          return item === coinPair1 || !listFilterCoinFrom[coinPair1].includes(item);
        });
      }

      if (coinPair2.length > 0 && coinPair2 !== coinPair1) {
        remove(listCoinFrom, (item: any) => {
          return item === coinPair2 || !listFilterCoinTo[coinPair2].includes(item);
        });
      }

      setListCoinHead(listCoinFrom);
      setListCoinLast(listCoinTo);
    }
  }, [dataBbPairList, coinPair1, coinPair2]);

  const onChangeDateStart = (e: any, dateStart: string) => {
    if (dateStart === '') setDateStart(0);
    else {
      let startDay: number = new Date(dateStart).setHours(0, 0, 0, 0);
      setDateStart(startDay);
    }
  };

  const onChangeDateEnd = (e: any, dateEnd: string) => {
    if (dateEnd === '') setDateEnd(0);
    else {
      let endDay: any = new Date(dateEnd).setHours(23, 59, 59, 999);
      setDateEnd(endDay);
    }
  };

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
      setHistoryType(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (sttOrderHistory === 'loading' || sttTradeHistory === 'loading') dispatch(setIsLoadingHistory(true));
    else dispatch(setIsLoadingHistory(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sttOrderHistory, sttTradeHistory]);

  const onClickSearch = () => requestData(1);
  const requestData = (pageCurrent: number) => {
    const data: TRequestHistory = {
      symbol: coinPair1.length === 0 || coinPair2.length === 0 ? '' : `${coinPair1}_${coinPair2}`,
      type: historyType,
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

  const onReset = () => {
    setDateStart(0);
    setDateEnd(0);
    setCoinPair1('');
    setCoinPair2('');
    setHistoryType(0);
    requestData(1);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterBySchedule}>
        {filterType !== 'openOrders' ? (
          <Space wrap>
            <DatePicker size="small" placeholder="Start" onChange={onChangeDateStart} className={styles.datePicker} />
            <div className={styles.devide} />
            <DatePicker size="small" placeholder="End" onChange={onChangeDateEnd} className={styles.datePicker} />
            <SelectWithLabel
              size="small"
              id="pairFrom"
              label="From"
              placeholder="From"
              onChange={(value: string) => setCoinPair1(value)}
              value={coinPair1}
            >
              {listCoinHead.map((entry: any, key) => {
                return (
                  <Option key={key} value={entry}>
                    {entry}
                  </Option>
                );
              })}
            </SelectWithLabel>
            <FontAwesomeIcon color="#788686" icon={faArrowRight} />
            <SelectWithLabel
              size="small"
              id="pairTo"
              label="To"
              onChange={(value: string) => setCoinPair2(value)}
              value={coinPair2}
            >
              {listCoinLast.map((entry: any, key) => {
                return (
                  <Option key={key} value={entry}>
                    {entry}
                  </Option>
                );
              })}
            </SelectWithLabel>
            <SelectWithLabel
              size="small"
              label="Type"
              defaultValue={0}
              onChange={(value: number) => setHistoryType(value)}
              value={historyType}
            >
              <Option value={0}>{t('historypage.other.open_order_type_all')}</Option>
              <Option value={1}>{t('historypage.other.open_order_type_buy')}</Option>
              <Option value={2}>{t('historypage.other.open_order_type_sell')}</Option>
            </SelectWithLabel>
            <AntdButton className={styles.btnReset} size="small" type="text" onClick={onReset}>
              <Space align="center">
                <FontAwesomeIcon color="rgba(75, 99, 107, 1)" icon={faTimes} />
              </Space>
            </AntdButton>
            <Button type="default" onClick={() => onClickSearch()}>
              Search
            </Button>
          </Space>
        ) : (
          <Space>
            <SelectWithLabel
              size="small"
              label="Type"
              defaultValue={0}
              onChange={(value: number) => setHistoryType(value)}
              value={historyType}
            >
              <Option value={0}>{t('historypage.other.open_order_type_all')}</Option>
              <Option value={1}>{t('historypage.other.open_order_type_buy')}</Option>
              <Option value={2}>{t('historypage.other.open_order_type_sell')}</Option>
            </SelectWithLabel>
          </Space>
        )}
      </div>
      <div>
        <OrderTable
          onChangeFilter={changeFilter}
          filterType={filterType}
          onChangePage={changePage}
          historyType={historyType}
        />
      </div>
    </div>
  );
};

export default MainContent;
