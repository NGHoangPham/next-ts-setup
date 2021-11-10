/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable no-case-declarations */
import { FC, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { Row, Col } from 'antd';
import { TradeBoard } from './components/TradeBoard';
import Wallet from './components/Wallet';
import OrdersHistory from './components/OrdersHistory';
import TradingChart from './components/TradingChart';

import PlaceOrder from './components/PlaceOrder';
import { useAppSelector, useAppDispatch } from 'hooks';
import { setCurrentPair } from 'store/ducks/system/slice';
import {
  setListPairValue,
  setCurrentPairValue,
  setDataDepth,
  setTradesData,
  setLastPrice,
} from 'store/ducks/exchange/slice';
import { usePairListQuery } from 'api/exchange';
import { USER_COOKIES, ORDER_CANCELED, ORDER_COMPLETE, isServer, WEB_SOCKET_URL } from 'utils/constant';
import { SubAccountHeader } from 'components/SubAccountHeader/SubAccountHeader';
import { getAuthToken } from 'api/auth_token';
import { useUser } from '@auth0/nextjs-auth0';
import Head from 'next/head';

type IFilterType = 'orderBook' | 'trades';

const ExchangePage: FC = () => {
  const dispatch = useAppDispatch();

  const { market, chart, orderBook, openOrders, walletSnap, currentPair } = useAppSelector(
    (state) => state.system.exchange
  );
  const { dataDepth, tradesData } = useAppSelector((state) => state.exchange);
  const [websocket, setWebSocket] = useState<any>();
  const [isSocketReady, setSocketReady] = useState(false);
  const [convertData, setConvertData] = useState<any>([]);
  const [listOrder, setListOrder] = useState<any>([]);
  const [openOrdersList, setOpenOrdersList] = useState<any>([]);
  const [loadingOpenOrders, setLoadingOpenOrders] = useState<any>(true);
  const [oldTradesPair, setOldTradesPair] = useState<any>(null);
  const [filterTypeTradeBoard, setFilterTypeTradeBoard] = useState<IFilterType>('orderBook');
  const listValue = useRef<any>([]);
  const { user } = useUser();
  let groupPairs: any = [];

  function sortBy(attr: any, rev: any) {
    if (rev === undefined) {
      rev = 1;
    } else {
      rev = rev ? 1 : -1;
    }

    return function (a: any, b: any) {
      a = parseFloat(a[attr]);
      b = parseFloat(b[attr]);
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    };
  }

  function weakening(arr: any, desc: any) {
    let m = '';
    if (desc) {
      for (let i = arr.length - 1; i >= 0; i--) {
        let item = arr[i];
        let n = item[0];
        let countLength = n.length;
        let decimal = n.split('.')[1];
        let length = 0;
        if (decimal) {
          length = decimal.length;
        }
        let obj: any = {};
        if (length > 2) {
          let change = n.substring(0, countLength - 2);
          if (m !== change || i === arr.length - 1) {
            obj.type = 1;
            m = change;
          } else {
            obj.type = 2;
            obj.first = change;
            obj.last = n.substring(countLength - 2);
          }
        } else {
          obj.type = 1;
        }
        item[4] = obj;
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        let n = item[0];
        let countLength = n.length;
        let decimal = n.split('.')[1];
        let length = 0;
        if (decimal) {
          length = decimal.length;
        }
        let obj: any = {};
        if (length > 2) {
          let change = n.substring(0, countLength - 2);
          if (m !== change || i === 0) {
            obj.type = 1;
            m = change;
          } else {
            obj.type = 2;
            obj.first = change;
            obj.last = n.substring(countLength - 2);
          }
        } else {
          obj.type = 1;
        }
        item[4] = obj;
      }
    }
  }

  let bids: any[] = dataDepth.bids || [];
  let asks: any[] = dataDepth.asks || [];

  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });

  // init socket
  useEffect(() => {
    if (!websocket && !isServer()) {
      setWebSocket(new window.WebSocket(WEB_SOCKET_URL));
    }
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (evt: any) => {
        handleSocketMessage(evt);
      };
      websocket.onopen = () => {
        setSocketReady(true);
      };
    }
  });

  // handle socket's message
  const handleSocketMessage = (evt: any) => {
    if (evt.data !== "{'ping':''}") {
      const convert = JSON.parse(evt.data);

      if (convert.channel) {
        switch (convert.channel) {
          case 'ticker':
            const index = listValue.current.findIndex((i: any) => i.pair === convert.pair);
            const pairData = convert.data;
            pairData.pair = convert.pair;

            const listData = [...listValue.current];

            if (index !== -1) {
              listData[index] = pairData;
              listValue.current = listData;
            } else {
              listValue.current = [...listValue.current, pairData];
            }
            dispatch(setListPairValue(listValue.current));

            break;
          case 'trades':
            if (convert.pair !== currentPair) {
              break;
            }

            var history = [...tradesData.history];

            if (history.length === 0 || (oldTradesPair && oldTradesPair !== currentPair)) {
              history = convert.data;
            } else {
              convert.data.forEach((item: any) => {
                history.unshift(item);
              });

              history = Array.from(new Set(history.map((v: any) => JSON.stringify(v))))
                .map((v: any) => JSON.parse(v))
                .sort(function (a, b) {
                  return b[3] - a[3];
                });

              if (history.length > 50) {
                history.splice(50, history.length - 50);
              }
            }

            var lastPrice = 0;
            var lastPriceType = 0;
            if (history.length > 0) {
              lastPrice = history[0][1];
              if (history.length > 1) {
                if (parseFloat(history[0][1]) > parseFloat(history[1][1])) {
                  lastPriceType = 2;
                }
                if (parseFloat(history[0][1]) < parseFloat(history[1][1])) {
                  lastPriceType = 3;
                }
                if (parseFloat(history[0][1]) === parseFloat(history[1][1])) {
                  lastPriceType = 1;
                }
              }
            }

            setOldTradesPair(convert.pair);
            dispatch(
              setTradesData({
                history: history,
                lastPriceMoney: lastPrice,
                lastPriceType: lastPriceType,
              })
            );
            dispatch(setLastPrice(lastPrice));
            break;
          case 'depth':
            if (convert.pair !== currentPair) {
              break;
            }
            // var temp = { ...dataDepth };

            var change = convert.data.change;
            if (change) {
              for (let changeIndex = 0; changeIndex < change.length; changeIndex++) {
                let price = parseFloat(change[changeIndex][0]);
                let absPrice = Math.abs(price);
                let newdata = 1;
                if (price > 0) {
                  let newBids = JSON.parse(JSON.stringify(bids));
                  for (let i = newBids.length - 1; i >= 0; i--) {
                    if (parseFloat(newBids[i][0]) === absPrice) {
                      if (parseFloat(change[changeIndex][1]) === 0) {
                        newBids.splice(i, 1);
                      } else {
                        newBids[i][1] = change[changeIndex][1];
                        newBids[i][2] = change[changeIndex][2];
                      }
                      newdata++;
                      break;
                    }
                  }
                  if (newdata === 1 && change[changeIndex][1] > 0) {
                    newBids.push(change[changeIndex]);
                    newBids.sort(sortBy(0, false));
                  }
                  let bidSum = 0;
                  newBids.sort(sortBy(0, false));
                  for (let i = 0; i < newBids.length; i++) {
                    bidSum += Number(newBids[i][1]);
                    newBids[i][5] = bidSum;
                  }
                  for (let i = 0; i < newBids.length; i++) {
                    let num = newBids[i][5] / bidSum;
                    if (num === 1) {
                      newBids[i][3] = '100%';
                    } else {
                      newBids[i][3] = num * 263 + 'px';
                    }
                  }
                  weakening(newBids, false);
                  bids = newBids;
                  // dispatch(setDataDepth(temp));
                } else if (price < 0) {
                  let newAsks = JSON.parse(JSON.stringify(asks));
                  for (let i = newAsks.length - 1; i >= 0; i--) {
                    if (parseFloat(newAsks[i][0]) === absPrice) {
                      if (parseFloat(change[changeIndex][1]) === 0) {
                        newAsks.splice(i, 1);
                      } else {
                        newAsks[i][1] = change[changeIndex][1];
                        newAsks[i][2] = change[changeIndex][2];
                      }
                      newdata++;
                      break;
                    }
                  }
                  if (newdata === 1 && change[changeIndex][1] > 0) {
                    change[changeIndex][0] = change[changeIndex][0].substring(1);
                    newAsks.push(change[changeIndex]);
                    newAsks.sort(sortBy(0, false));
                  }
                  let askSum = 0;
                  newAsks.sort(sortBy(0, false));
                  for (let i = 0; i < newAsks.length; i++) {
                    askSum += Number(newAsks[i][1]);
                    newAsks[i][5] = askSum;
                  }
                  for (let i = 0; i < newAsks.length; i++) {
                    let num = newAsks[i][5] / askSum;
                    if (num === 1) {
                      newAsks[i][3] = '100%';
                    } else {
                      newAsks[i][3] = num * 263 + 'px';
                    }
                  }
                  weakening(newAsks, true);
                  asks = newAsks;
                  // dispatch(setDataDepth(temp));
                }
              }
            } else {
              bids = convert.data.bids;
              asks = convert.data.asks;

              let bidSum = 0;
              bids.sort(sortBy(0, false));
              for (let i = 0; i < bids.length; i++) {
                bidSum += Number(bids[i][1]);
                bids[i][5] = bidSum;
              }

              for (let i = 0; i < bids.length; i++) {
                let num = bids[i][5] / bidSum;
                if (num === 1) {
                  bids[i][3] = '100%';
                } else {
                  bids[i][3] = num * 263 + 'px';
                }
              }
              weakening(bids, false);

              let askSum = 0;
              asks.sort(sortBy(0, false));
              for (let i = 0; i < asks.length; i++) {
                askSum += Number(asks[i][1]);
                asks[i][5] = askSum;
              }

              for (let i = 0; i < asks.length; i++) {
                let num = asks[i][5] / askSum;
                if (num === 1) {
                  asks[i][3] = '100%';
                } else {
                  asks[i][3] = num * 263 + 'px';
                }
              }
              weakening(asks, true);
            }

            dispatch(
              setDataDepth({
                bids: bids,
                asks: asks,
              })
            );
            break;
          case 'auth-orders':
            if (convert.data) {
              var authOrders: string[] = [...openOrdersList];
              if (authOrders.length > 0) {
                convert.data.forEach((item: any) => {
                  const orderExist = authOrders.find((i) => i[0] === item[0]);
                  //case orderExist !== undefined
                  if (orderExist !== undefined) {
                    if (item[9] === '3' || item[9] === '4') {
                      //status canceled & complete, remove item from list
                      authOrders = authOrders.filter((i) => i[0] !== item[0]); //if data server stt(3,4) remove item from list
                    } else {
                      let index = 0;
                      authOrders.forEach((i, key) => {
                        if (i[0] === item[0]) {
                          index = key;
                        }
                      });
                      authOrders[index] = item;
                    }
                  } else if (!orderExist && item[9] !== ORDER_CANCELED && item[9] !== ORDER_COMPLETE) {
                    //case orderExist undefined & stt(!= 3,4)
                    authOrders.unshift(item);
                  }
                });
              } else {
                convert.data.forEach((item: any) => {
                  if (item[9] !== ORDER_CANCELED && item[9] !== ORDER_COMPLETE) {
                    authOrders.push(item);
                  }
                });
              }
              setOpenOrdersList(authOrders);
              setLoadingOpenOrders(false);
            }
            break;
          case 'auth-xorders':
            var orders = [...listOrder];
            if (orders.length > 0) {
              convert.data.forEach((item: any) => {
                const orderExist = orders.find((i) => i[0] === item[0]);
                if (orderExist !== undefined) {
                  if (item[9] === '3' || item[9] === '4') {
                    orders = orders.filter((i) => i[0] !== item[0]);
                  } else {
                    let index = 0;
                    orders.forEach((i, key) => {
                      if (i[0] === item[0]) {
                        index = key;
                      }
                    });
                    orders[index] = item;
                  }
                } else {
                  if (item[9] !== '3' && item[9] !== '4') {
                    orders.unshift(item);
                  }
                }
              });
            } else {
              convert.data.forEach((i: any) => {
                if (i[9] !== '3' && i[9] !== '4') {
                  orders.push(i);
                }
              });
            }
            setListOrder(orders);
            break;
          default:
            break;
        }
      }

      if (convert.event && convert.event === 'loginToken') {
        const authWalletMsg = `{"event":"subscribe", "channel":"auth-wallet"}`;
        websocket.send(authWalletMsg);

        setLoadingOpenOrders(true);
        const authOrderMsg = `{"event":"subscribe", "channel":"auth-orders","pageSize": 10,"pageIndex": 1}`;
        websocket.send(authOrderMsg);
      }
    }
  };

  // subscribe channel when rocket ready
  useEffect(() => {
    if (isSocketReady) {
      handleAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketReady]);
  useEffect(() => {
    if (isSocketReady && pairList) {
      pairList.forEach((pair: any) => {
        const msg = `{"event":"subscribe", "channel":"ticker","pair":"${pair[0]}"}`;
        websocket.send(msg);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketReady, pairList]);
  const handleAuth = async () => {
    if (user) {
      const authTokenResponse = await getAuthToken();
      if (authTokenResponse['auth-token']) {
        const authTokenMsg = `{"event":"loginToken", "token":"${authTokenResponse['auth-token']}"}`;
        websocket.send(authTokenMsg);
      }
    }
  };
  useEffect(() => {
    if (isSocketReady) {
      if (currentPair) {
        if (filterTypeTradeBoard === 'trades') {
          const tradesMsg = `{"event":"subscribe", "channel":"trades","pair":"${currentPair}","last":30}`;
          websocket.send(tradesMsg);
        }
        if (filterTypeTradeBoard === 'orderBook') {
          const depthMsg = `{"event":"subscribe", "channel":"depth","pair":"${currentPair}","prec":0,"depth": 30}`;
          websocket.send(depthMsg);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketReady, currentPair, filterTypeTradeBoard]);

  // convert pairList data
  useEffect(() => {
    if (pairList && pairList.length > 0) {
      pairList.forEach((item: any) => {
        formLeverFun(item);
      });
      setConvertData(groupPairs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairList]);
  const formLeverFun = (item: any) => {
    if (parseFloat(item[9]) === 3) {
      return;
    }

    const coinType = item[0].split('_')[1];

    if (groupPairs.length === 0) {
      const obj: any = {};
      obj.type = item[5];
      obj.list_m = [
        {
          pair: item[0],
          searchPair: coinType,
          // star: item[10],
          pairType: item[9],
          decimal: item[3],
          data: [...pairList.find((i: any) => i[0] === item[0])],
        },
      ];
      obj.list_s = [coinType];
      obj.searchValue = coinType;
      obj.searchIndex = 0;
      groupPairs.push(obj);
    } else {
      let n = 0;

      groupPairs.forEach((groupPair: any) => {
        if (parseFloat(groupPair.type) === parseFloat(item[5])) {
          n++;

          groupPair.list_m.push({
            pair: item[0],
            searchPair: coinType,
            // star: item[10],
            pairType: item[9],
            decimal: item[3],
            data: [...pairList.find((i: any) => i[0] === item[0])],
          });

          let xx = 0;
          groupPair.list_s.forEach((xxx: any) => {
            if (xxx === coinType) {
              xx++;
            }
          });

          if (xx === 0) {
            groupPair.list_s.push(coinType);
          }
        }
      });

      if (n === 0) {
        let obj: any = {};
        obj.type = item[5];
        obj.list_m = [
          {
            pair: item[0],
            searchPair: coinType,
            star: item[10],
            pairType: item[9],
            decimal: item[3],
            data: [...pairList.find((i: any) => i[0] === item[0])],
          },
        ];
        obj.list_s = [coinType];
        obj.searchValue = coinType;
        obj.searchIndex = 0;
        groupPairs.push(obj);
      }
    }

    if (parseFloat(item[9]) === 2) {
      let newItem = Object.assign({}, item);
      newItem[9] = 4;
      newItem[5] = 4;
      formLeverFun(newItem);
    }
  };
  // identify current pair
  useEffect(() => {
    if (convertData.length > 0 && convertData[0].list_m && convertData[0].list_m.length > 0) {
      let temp = convertData[0].list_m[0].data;

      if (localStorage.getItem(USER_COOKIES.currentPair)) {
        let tempName = localStorage.getItem(USER_COOKIES.currentPair);

        const check = convertData[0].list_m.find((item: any) => item.pair === tempName);
        temp = check ? check.data : convertData[0].list_m[0].data;
      }

      localStorage.setItem(USER_COOKIES.currentPair, temp[0]);
      dispatch(setCurrentPair(temp[0]));
      dispatch(setCurrentPairValue(temp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertData]);

  return (
    <>
      <Head>
        <script src="/datafeeds/udf/dist/polyfills.js"></script>
        <script src="/datafeeds/udf/dist/bundle.js"></script>
      </Head>
      <div className={clsx(styles.root, 'container')}>
        <Row gutter={[24, 24]} className={styles.mainRow}>
          <Col span={24}>
            <SubAccountHeader />
          </Col>
          <Col span={5}>
            {orderBook && <TradeBoard filterType={filterTypeTradeBoard} setFilterType={setFilterTypeTradeBoard} />}
          </Col>
          <Col span={14} className={styles.tradingChartCol}>
            {chart && <TradingChart convertData={convertData} />}
          </Col>
          <Col span={5}>{market && <PlaceOrder />}</Col>
        </Row>
        <Row gutter={[24, 24]} className={styles.mainRow}>
          <Col span={19}>
            {openOrders && <OrdersHistory openOrdersList={openOrdersList} loadingOpenOrders={loadingOpenOrders} />}
          </Col>
          <Col span={5}>{walletSnap && <Wallet />}</Col>
        </Row>
      </div>
    </>
  );
};

export default ExchangePage;
