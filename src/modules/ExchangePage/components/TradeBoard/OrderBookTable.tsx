import { FC, useState, useEffect, memo, useRef } from 'react';
import { Popover, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Surface } from 'components/Surface';
import styles from './OrderBookTable.module.css';
import clsx from 'clsx';
import { nDecimalFormat } from 'utils/number';
import { setOrderBookSelect } from 'store/ducks/exchange/slice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getCurrentPairValue, getDataDepth, getTradesData } from 'store/ducks/exchange/slice';

// eslint-disable-next-line react/display-name
export const OrderBookTable: FC = memo(() => {
  const MIN_ROWS = 9;
  const [headerDatatables] = useState<any[]>([]);
  const [asksDatatables, setAsksDatatables] = useState<any[]>([]);
  const [bidsDatatables, setBidsDatatables] = useState<any[]>([]);
  const [lastPriceDatatables, setLastPriceDatatables] = useState<any[]>([]);
  const [dataExchange, setDataExchange] = useState<any>({
    avgPrice: 0,
    totalCoin: 0,
    totalMoney: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hoverAsksIndex, setHoverAsksIndex] = useState<any>(-1);
  const [hoverBidsIndex, setHoverBidsIndex] = useState<any>(-1);
  const dispatch = useAppDispatch();
  const tradesData = useAppSelector(getTradesData);
  const dataDepth = useAppSelector(getDataDepth);
  const currentPairValue = useAppSelector(getCurrentPairValue);
  const { listPairValue } = useAppSelector((state) => state.exchange);
  const { currentPair } = useAppSelector((state) => state.system.exchange);
  const asksTableRef = useRef<any>(null);
  const bidsTableRef = useRef<any>(null);
  const pairDisplayAsksRef = useRef<any>(null);
  const pairDisplayBidsRef = useRef<any>(null);
  const bidsHoverOutTimeout = useRef<any>(null);
  const asksHoverOutTimeout = useRef<any>(null);

  useEffect(() => {
    let headerData = null;
    if (listPairValue.length > 0) {
      headerData = listPairValue.find((listPairValue_item: any) => listPairValue_item.pair === currentPair);
    }
    setLastPriceDatatables([
      {
        id: 1,
        price: headerData?.last ? nDecimalFormat(headerData.last, currentPairValue?.[3] ?? 2) : 0,
        amount: 'last price',
        total:
          tradesData.lastPriceType === 3 ? (
            <FontAwesomeIcon icon={faCaretDown} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faCaretUp} size="lg" />
          ),
      },
    ]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPairValue, currentPair]);

  // convert data
  useEffect(() => {
    let bids = dataDepth.bids;
    let asks = dataDepth.asks;

    let dataAsks: any[] = [];
    let dataBids: any[] = [];

    if (bids) {
      bids.forEach((bid: any, index: number) => {
        let price = 0;
        if (bid[4].type !== 2) {
          price = bid[0];
        } else {
          price = bid[4].first;
        }
        dataBids.push({
          id: index,
          price: nDecimalFormat('' + price, currentPairValue?.[3] ?? 2),
          amount: nDecimalFormat(bid[1], currentPairValue?.[2] ?? 2),
          total: nDecimalFormat('' + parseFloat(bid[0]) * parseFloat(bid[1]), currentPairValue?.[3] ?? 2),
        });
      });
    }

    if (asks) {
      asks.forEach((ask: any, index: number) => {
        let price = 0;
        if (ask[4].type !== 2) {
          price = ask[0];
        } else {
          price = ask[4].first;
        }
        dataAsks.push({
          id: index,
          price: nDecimalFormat('' + price, currentPairValue?.[3] ?? 2),
          amount: nDecimalFormat(ask[1], currentPairValue?.[2] ?? 2),
          total: nDecimalFormat('' + parseFloat(ask[0]) * parseFloat(ask[1]), currentPairValue?.[3] ?? 2),
        });
      });
    }

    if (asks.length < MIN_ROWS) {
      for (let i = 0; i < MIN_ROWS - asks.length; i = i + 1) {
        dataAsks.unshift({
          id: 'fake' + i,
          price: '--',
          amount: '--',
          total: '--',
        });
      }
    }
    if (bids.length < MIN_ROWS) {
      for (let i = 0; i < MIN_ROWS - bids.length; i = i + 1) {
        dataBids.push({
          id: 'fake' + i,
          price: '--',
          amount: '--',
          total: '--',
        });
      }
    }

    setLoading(false);
    setBidsDatatables(dataBids);
    setAsksDatatables(dataAsks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDepth]);

  // scroll bottom of asks panel when currentPair change
  useEffect(() => {
    if (pairDisplayAsksRef.current !== currentPair) {
      asksTableRef.current.scrollTop = asksTableRef.current.scrollHeight;
      pairDisplayAsksRef.current = currentPair;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asksDatatables]);

  // scroll bottom of bids panel when currentPair change
  useEffect(() => {
    if (pairDisplayBidsRef.current !== currentPair) {
      bidsTableRef.current.scrollTop = 0;
      pairDisplayBidsRef.current = currentPair;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidsDatatables]);

  const getColumns = (): any[] => {
    return [
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        align: 'left',
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        align: 'right',
      },
      {
        title: 'Total',
        key: 'total',
        dataIndex: 'total',
        align: 'right',
      },
    ];
  };

  const onRowClick = (type: string) => {
    dispatch(
      setOrderBookSelect({
        type: type,
        price: dataExchange.uniquePrice,
        amount: dataExchange.totalCoin,
      })
    );
  };

  useEffect(() => {
    fnCalcDataExchange('asks', hoverAsksIndex - (asksDatatables.length - dataDepth.asks.length));
    asksTableRef.current.querySelectorAll('tr').forEach((row: any, pos: number) => {
      let index = parseInt(row.attributes['data-id']?.value);
      if (!isNaN(index) && pos >= hoverAsksIndex && hoverAsksIndex > 0) {
        row.classList.add('appAsksRowHover');
      } else {
        row.classList.remove('appAsksRowHover');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverAsksIndex]);
  useEffect(() => {
    fnCalcDataExchange('bids', hoverBidsIndex);
    bidsTableRef.current.querySelectorAll('tr').forEach((row: any, pos: number) => {
      let index = parseInt(row.attributes['data-id']?.value);
      if (!isNaN(index) && pos <= hoverBidsIndex) {
        row.classList.add('appBidsRowHover');
      } else {
        row.classList.remove('appBidsRowHover');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverBidsIndex]);

  useEffect(() => setLoading(true), []);

  const fnCalcDataExchange = (type: string, index: number) => {
    let beginIndex = 0;
    let endIndex = 0;
    let arr = [];
    let totalPrice = 0;
    let totalCoin = 0;
    let totalMoney = 0;
    let countIndex = 0;
    let avgPrice = 0;
    let uniquePrice = 0;
    let isUniqueMax = true;
    if (index < 0) {
      return;
    } else {
      switch (type) {
        case 'asks':
          beginIndex = index;
          endIndex = dataDepth.asks.length - 1;
          arr = dataDepth.asks;
          isUniqueMax = true;
          break;
        case 'bids':
          beginIndex = 0;
          endIndex = index;
          arr = dataDepth.bids;
          isUniqueMax = false;
          break;
        default:
          break;
      }
      for (let i = beginIndex; i <= endIndex; i = i + 1) {
        countIndex = countIndex + 1;
        let item = arr[i];
        let price = 0;
        let amount = parseFloat(item?.[1] ?? 0);
        let total = parseFloat(item?.[0] ?? 0) * parseFloat(item?.[1] ?? 0);
        if (item?.[4]?.type !== 2) {
          price = parseFloat(item?.[0] ?? 0);
        } else {
          price = parseFloat(item?.[4]?.first ?? 0);
        }
        if (isUniqueMax) {
          uniquePrice = uniquePrice !== 0 && uniquePrice >= price ? uniquePrice : price;
        } else {
          uniquePrice = uniquePrice !== 0 && uniquePrice <= price ? uniquePrice : price;
        }

        totalPrice = totalPrice + price;
        totalCoin = totalCoin + amount;
        totalMoney = totalMoney + total;
      }
      if (countIndex > 0) {
        avgPrice = totalPrice / countIndex;
      }

      setDataExchange({
        avgPrice: avgPrice,
        totalCoin: totalCoin,
        totalMoney: totalMoney,
        uniquePrice: uniquePrice,
      });
    }
  };

  const getOverlayContent = () => {
    return (
      <div className={styles.overlayContent}>
        <p>Avg.Price: ≈ {nDecimalFormat('' + dataExchange.avgPrice, currentPairValue?.[3] ?? 2)}</p>
        <p>Sum BTC: {nDecimalFormat('' + dataExchange.totalCoin, currentPairValue?.[2] ?? 2)}</p>
        <p>Sum USDT: {nDecimalFormat('' + dataExchange.totalMoney, currentPairValue?.[3] ?? 2)}</p>
      </div>
    );
  };

  const onPopoverVisibleChange = (visible: boolean, type: string, position: number) => {
    if (visible) {
      switch (type) {
        case 'asks':
          if (asksHoverOutTimeout.current) {
            clearTimeout(asksHoverOutTimeout.current);
          }
          setHoverAsksIndex(position);
          break;
        case 'bids':
          if (bidsHoverOutTimeout.current) {
            clearTimeout(bidsHoverOutTimeout.current);
          }
          setHoverBidsIndex(position);
          break;
        default:
          break;
      }
    } else {
      asksHoverOutTimeout.current = setTimeout(() => {
        setHoverAsksIndex(-1);
      }, 10);
      bidsHoverOutTimeout.current = setTimeout(() => {
        setHoverBidsIndex(-1);
      }, 10);
    }
  };

  return (
    <Surface className={styles.root} borderLess>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <Table dataSource={headerDatatables} columns={getColumns()} size="small" />
        </div>
        <div className={styles.tableSellWrap}>
          <div className={clsx(styles.tableSell, styles.scroll)} ref={asksTableRef}>
            <table className={styles.datatable}>
              <tbody>
                {asksDatatables.map((item, position) => {
                  if (isNaN(parseInt(item.id))) {
                    return (
                      <tr key={item.id} className={styles.rowSell} data-id={item.id}>
                        <td>{item.price}</td>
                        <td>{item.amount}</td>
                        <td>{item.total}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <Popover
                        key={item.id}
                        content={getOverlayContent()}
                        trigger="hover"
                        overlayClassName={styles.overlayWrapper}
                        placement="left"
                        onVisibleChange={(visible: boolean) => {
                          onPopoverVisibleChange(visible, 'asks', position);
                        }}
                        visible={isNaN(parseInt(item.id)) ? false : undefined}
                      >
                        <tr
                          className={styles.rowSell}
                          data-id={item.id}
                          onClick={() => {
                            onRowClick('asks');
                          }}
                        >
                          <td>{item.price}</td>
                          <td>{item.amount}</td>
                          <td>{item.total}</td>
                        </tr>
                      </Popover>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={clsx(styles.tableLastPrice)}>
          <Table
            dataSource={lastPriceDatatables}
            rowKey="id"
            loading={loading}
            columns={getColumns()}
            pagination={false}
            size="small"
            rowClassName={styles.rowLastPrice}
            showHeader={false}
          />
        </div>

        <div className={styles.tableBuyWrap}>
          <div className={clsx(styles.tableBuy, styles.scroll)} ref={bidsTableRef}>
            <table className={styles.datatable}>
              <tbody>
                {bidsDatatables.map((item, position) => (
                  <Popover
                    key={item.id}
                    content={getOverlayContent()}
                    trigger="hover"
                    overlayClassName={styles.overlayWrapper}
                    placement="left"
                    onVisibleChange={(visible: boolean) => {
                      onPopoverVisibleChange(visible, 'bids', position);
                    }}
                    visible={isNaN(parseInt(item.id)) ? false : undefined}
                  >
                    <tr
                      className={styles.rowBuy}
                      data-id={item.id}
                      onClick={() => {
                        onRowClick('bids');
                      }}
                    >
                      <td>{item.price}</td>
                      <td>{item.amount}</td>
                      <td>{item.total}</td>
                    </tr>
                  </Popover>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Surface>
  );
});
