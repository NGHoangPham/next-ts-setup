import React, { useState, useEffect } from 'react';
import styles from './PairSelectorPanel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faSearch,
  faEye,
  faSortUp,
  faSortDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { Col, Row } from 'antd';
import { FilterGroup } from 'components/FilterGroup';
import { Space, Table } from 'antd';
import { Input } from 'components/Input';
import { ColumnsType } from 'antd/lib/table';
import { Avatar } from 'components/Avatar';
import { currencyImgs } from 'assets/images/currency';
import SortIcon from 'components/SortIcon';
import { useTranslation } from 'next-i18next';
import { useAppSelector, useAppDispatch } from 'hooks';
import { setCurrentPairValue, getCurrentPairValue } from 'store/ducks/exchange/slice';
import { setCurrentPair } from 'store/ducks/system/slice';
import { nDecimalFormat } from 'utils/number';
import { Dropdown, Menu } from 'antd';
import { USER_COOKIES } from 'utils/constant';
import { getCookies, setCookies } from 'utils/cookies';

interface PairSelectorPanelProps {
  visible: boolean;
  onClose?: Function;
  isDropdown?: boolean;
  convertData: any[];
  filterType: string;
  onChangeFilterType: Function | undefined;
  fiat: string;
  onChangeFiat: Function | undefined;
}

const PairSelectorPanel: React.FC<PairSelectorPanelProps> = ({
  visible,
  onClose,
  isDropdown,
  convertData,
  filterType = 'all',
  onChangeFilterType,
  fiat = null,
  onChangeFiat,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<any>('');
  const [sortInfo, setSortInfo] = useState<any>({
    column: 'pair',
    direction: 0,
  });
  const [tableRows, setTableRows] = useState<any[]>([]);
  const { listPairValue } = useAppSelector((state) => state.exchange);
  const { fullscreen } = useAppSelector((state) => state.system.exchange);
  const currentPairValue = useAppSelector(getCurrentPairValue);
  const [fiatList, setFiatList] = useState<any>([]);
  const [watchPairs, setWatchPairs] = useState<any>([]);
  const [listM, setListM] = useState<any>([]);

  interface TOrderTable {
    date: number;
    pair: string;
    price: string;
    priceUsd: string;
    dchangePec: number;
  }

  const columns: ColumnsType<TOrderTable> = [
    {
      key: 'active',
      render(record) {
        return (
          <FontAwesomeIcon
            className={clsx(styles.faEye, watchPairs.includes(record.pair) ? styles.faEyeActive : null)}
            icon={faEye}
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              fnWatchPair(record);
            }}
          />
        );
      },
    },
    {
      title: (
        <SortIcon
          level={sortInfo.column === 'pair' ? sortInfo.direction : 0}
          onChangeOrder={(newOrder: any) => {
            setSortInfo({
              column: 'pair',
              direction: newOrder,
            });
          }}
        >
          {t('exchange.trading_chart.pair')}
        </SortIcon>
      ),
      key: 'pair',
      dataIndex: 'pair',
      render(pairStr) {
        const pairSplit = pairStr.split('_');
        return (
          <Space>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[0]}</span>
            </Space>
            <span className="bold default">/</span>
            <Space>
              <Avatar size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
              <span className="bold default">{pairSplit[1]}</span>
            </Space>
          </Space>
        );
      },
    },
    {
      title: (
        <SortIcon
          level={sortInfo.column === 'price' ? sortInfo.direction : 0}
          onChangeOrder={(newOrder: any) => {
            setSortInfo({
              column: 'price',
              direction: newOrder,
            });
          }}
        >
          {t('exchange.trading_chart.price')}
        </SortIcon>
      ),
      key: 'price',
      dataIndex: 'price',
      render(price, record) {
        return (
          <>
            <p className={record.dchangePec >= 0 ? styles.paraSuccess : styles.paraDanger}>{price}</p>
            <p className={styles.paraDark}>{record.priceUsd}</p>
          </>
        );
      },
    },
    {
      title: (
        <SortIcon
          level={sortInfo.column === 'dchangePec' ? sortInfo.direction : 0}
          onChangeOrder={(newOrder: any) => {
            setSortInfo({
              column: 'dchangePec',
              direction: newOrder,
            });
          }}
        >
          {t('exchange.trading_chart.change')}
        </SortIcon>
      ),
      key: 'dchangePec',
      dataIndex: 'dchangePec',
      render(dchangePec) {
        return (
          <Row wrap={false}>
            <Col flex="auto">
              <p className={dchangePec >= 0 ? styles.paraSuccess : styles.paraDanger}>
                <span className={styles.percentage}>
                  <FontAwesomeIcon
                    className={clsx(styles.sortIcon, dchangePec >= 0 ? styles.sortUp : styles.sortDown)}
                    icon={dchangePec >= 0 ? faSortUp : faSortDown}
                  />{' '}
                  {Math.abs(dchangePec).toFixed(2)} %
                </span>
              </p>
              <p className={styles.paraDark}>24h</p>
            </Col>
            <Col flex="none" className={styles.detailIconCol}>
              <button className={clsx(styles.transButton, styles.detailIcon)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </Col>
          </Row>
        );
      },
    },
  ];

  const fnWatchPair = (record: any) => {
    let watchpairs = [...watchPairs];
    let index = watchpairs.indexOf(record.pair);
    if (index >= 0) {
      watchpairs.splice(index, 1);
    } else {
      watchpairs.push(record.pair);
    }

    setCookies(USER_COOKIES.watchPairs, JSON.stringify(watchpairs));

    setWatchPairs(watchpairs);
  };

  useEffect(() => {
    let localWatchPairs: any = getCookies(USER_COOKIES.watchPairs);
    try {
      localWatchPairs = JSON.parse(localWatchPairs);
      if (Array.isArray(localWatchPairs)) {
        setWatchPairs(localWatchPairs);
      }
    } catch (e) {
      // do nothing
    }
  }, []);

  useEffect(() => {
    let list: any = [];
    const blackPairs: any = [];
    if (filterType === 'innovation') {
      convertData.forEach((convertedItem: any) => {
        if (convertedItem.type === '2' && convertedItem.list_m && convertedItem.list_m.length > 0) {
          list = convertedItem.list_m;
        }
      });
    } else {
      convertData.forEach((convertedItem: any) => {
        if (convertedItem.list_m && convertedItem.list_m.length > 0) {
          convertedItem.list_m.forEach((item: any) => {
            if (blackPairs.indexOf(item.pair) < 0) {
              blackPairs.push(item.pair);
              list.push(item);
            }
          });
        }
      });
    }

    setListM(list);
  }, [convertData, filterType]);

  useEffect(() => {
    let fiatList: any = [];
    convertData.forEach((item: any) => {
      fiatList = fiatList.concat(item.list_s);
    });
    fiatList = fiatList.filter((ele: any, pos: any, arr: any) => arr.indexOf(ele) === pos && ele !== 'BTC');
    setFiatList(fiatList);
  }, [convertData]);

  useEffect(() => {
    let filterList: any = [];
    if (listPairValue.length > 0 && listM.length > 0) {
      filterList = listPairValue.filter((listPairValue_item: any) =>
        listM.find((pair_item: any) => pair_item.pair === listPairValue_item.pair)
      );

      // apply filterType
      let filterFiat: any = null;
      switch (filterType) {
        case 'btc':
          filterFiat = 'BTC';
          break;
        case 'fiat':
          filterFiat = fiat;
          break;
        default:
          break;
      }
      if (filterFiat !== null) {
        filterList = filterList.filter((listPairValue_item: any) => {
          let splits = listPairValue_item.pair.split('_');
          return splits[1].toUpperCase() === filterFiat;
        });
      }

      // watchlist
      if (filterType === 'watchlist') {
        filterList = filterList.filter((listPairValue_item: any) => {
          return watchPairs.includes(listPairValue_item.pair);
        });
      }

      // filter by search box
      filterList = filterList.filter((listPairValue_item: any) =>
        listPairValue_item.pair.includes(searchText.toUpperCase())
      );
    }

    // apply sort
    let sortCallback = null;
    if (filterList.length > 0 && sortInfo.direction != 0) {
      let direction = sortInfo.direction;
      if (direction === 2) {
        direction = -1;
      }

      switch (sortInfo.column) {
        case 'pair':
          sortCallback = (a: any, b: any) => {
            if (a.pair < b.pair) return -direction;
            if (a.pair > b.pair) return direction;
            return 0;
          };
          break;
        case 'price':
          sortCallback = (a: any, b: any) => {
            let aValue = parseFloat(a.last);
            let bValue = parseFloat(b.last);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        case 'dchangePec':
          sortCallback = (a: any, b: any) => {
            let aValue = parseFloat(a.dchange_pec);
            let bValue = parseFloat(b.dchange_pec);
            if (aValue < bValue) return -direction;
            if (aValue > bValue) return direction;
            return 0;
          };
          break;
        default:
          break;
      }
    }
    if (sortCallback) {
      filterList = filterList.sort(sortCallback);
    }

    if (filterList.length > 0) {
      const rows: any[] = [];
      filterList.forEach((item: any, index: number) => {
        rows.push({
          id: index,
          date: new Date().getTime(),
          pair: item.pair,
          price: nDecimalFormat(item.last, currentPairValue?.[3] ?? 2),
          priceUsd: `$ ${nDecimalFormat(getUsdUnit(item), 2)}`,
          dchangePec: parseFloat(item.dchange_pec),
        });
      });
      setTableRows(rows);
    } else {
      setTableRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listM, listPairValue, searchText, sortInfo, filterType, watchPairs]);

  const activateCurrentPair = (currentPair: any) => {
    if (listM.length > 0) {
      const check = listM.find((item: any) => item.pair === currentPair);
      let temp = check ? check.data : listM[0].data;

      localStorage.setItem(USER_COOKIES.currentPair, temp[0]);
      dispatch(setCurrentPair(temp[0]));
      dispatch(setCurrentPairValue(temp));
      if (onClose) {
        onClose();
      }
    }
  };

  const resolutionOverlay = (
    <Menu>
      {fiatList.map((fiatItem: any) => (
        <Menu.Item
          key={fiatItem}
          onClick={() => {
            fnChangeFilterType('fiat');
            fnChangeFiat(fiatItem);
          }}
        >
          {fiatItem}
        </Menu.Item>
      ))}
    </Menu>
  );

  const fnChangeFilterType = (newFilterType: any) => {
    if (onChangeFilterType) {
      onChangeFilterType(newFilterType);
    }
  };

  const fnChangeFiat = (newFiat: any) => {
    if (onChangeFiat) {
      onChangeFiat(newFiat);
    }
  };

  const getUsdUnit = (pairData: any) => {
    let price = pairData.last;
    let money = pairData.pair.split('_')[1];

    if (money === 'USDT') {
      return price;
    }

    let item = listPairValue.find((ele: any) => {
      return ele.pair === money + '_USDT';
    });

    if (item) {
      return '' + parseFloat(item.last) * parseFloat(price);
    }

    return price;
  };

  return (
    <div
      className={clsx(
        isDropdown ? styles.dropdownPanel : styles.staticPanel,
        isDropdown && fullscreen ? styles.dropdownFullscreen : undefined
      )}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.dropdownWrap}>
        <div className={clsx(styles.mask, styles.firstMask)}></div>
        <div className={clsx(styles.mask, styles.secondMask)}></div>
        <div className={clsx(styles.mask, styles.thirdMask)}></div>
        <div className={styles.dropdownContent}>
          <Row wrap={false}>
            <Col flex="auto">
              <Space direction="horizontal" wrap>
                <FilterGroup
                  filled
                  datas={[
                    { label: 'ALL', value: 'all' },
                    { label: 'WATCH LIST', value: 'watchlist' },
                    {
                      label: (
                        <Dropdown overlay={resolutionOverlay}>
                          <span>{fiat ?? 'FIAT'}</span>
                        </Dropdown>
                      ),
                      value: 'fiat',
                    },
                    { label: 'BTC', value: 'btc' },
                    { label: 'INNOVATION', value: 'innovation' },
                  ]}
                  value={filterType}
                  onChange={(e) => {
                    let activeFiat = null;
                    var filterType = e.target.value;
                    if (filterType === 'fiat') {
                      return;
                    }
                    fnChangeFiat(activeFiat);
                    fnChangeFilterType(filterType);
                  }}
                />
              </Space>
            </Col>
            <Col flex="none">
              <button
                className={clsx(styles.transButton, styles.closeDropdownButton)}
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </Col>
          </Row>

          <div className={styles.searchWrap}>
            <Input
              placeholder="Type Crypto Name"
              className={styles.searchInput}
              value={searchText}
              onChange={(e: any) => {
                setSearchText(e.target.value);
              }}
            />
            <button className={clsx(styles.transButton, styles.searchSubmit)}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className={clsx(styles.table, styles.scroll)}>
            <Table
              dataSource={tableRows}
              rowKey="id"
              columns={columns}
              pagination={false}
              size="small"
              onRow={(record) => {
                return {
                  onClick: (e) => {
                    e.preventDefault();
                    activateCurrentPair(record.pair);
                  },
                };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairSelectorPanel;
