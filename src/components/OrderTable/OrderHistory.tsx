import { FC, useMemo } from 'react';
import { Space, Table } from 'antd';
import dayjs from 'dayjs';
import { nDecimalFormat } from 'utils/number';
import numeral from 'numeral';
import { useAppSelector } from 'hooks';

import styles from './OrderTable.module.css';
import { Avatar } from 'components/Avatar';
import { ColumnsType } from 'antd/lib/table';
import { currencyImgs } from 'assets/images/currency';
import { THistoryData } from 'api/history';
import { PaginationForm } from 'components/Pagination/Pagination';
import { useTranslation } from 'next-i18next';

const getColumns = (t: Function): ColumnsType<THistoryData> => [
  {
    title: t('historypage.columns.date'),
    key: 'time',
    dataIndex: 'time',
    sorter: (a: any, b: any) => a.time - b.time,
    showSorterTooltip: false,
    render(value: any) {
      return <span>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
    },
  },
  {
    title: t('historypage.columns.pair'),
    key: 'pair',
    dataIndex: 'pair',
    sorter: (a: any, b: any) => a.pair.localeCompare(b.pair),
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
    key: 'type',
    dataIndex: 'orderType',
    render(value) {
      return <span>{value}</span>;
    },
  },
  {
    title: t('historypage.columns.side'),
    key: 'side',
    dataIndex: 'sell',
    render(side) {
      return <span className={!side ? 'success' : 'error'}>{side ? ' Sell' : 'Buy'}</span>;
    },
  },
  {
    title: t('historypage.columns.avgPrice'),
    key: 'avgPrice',
    dataIndex: 'avgPrice',
    sorter: (a: any, b: any) => a.avgPrice - b.avgPrice,
    showSorterTooltip: false,
    render(avgPrice) {
      return nDecimalFormat(avgPrice, 2);
    },
  },
  {
    title: t('historypage.columns.price'),
    key: 'price',
    dataIndex: 'price',
    sorter: (a: any, b: any) => a.price - b.price,
    showSorterTooltip: false,
    render(price, record) {
      return record.orderType === 'MARKET' ? 'Market Price' : nDecimalFormat(price, 2);
    },
  },
  {
    title: t('historypage.columns.amount'),
    key: 'amount',
    dataIndex: 'amount',
    sorter: (a: any, b: any) => a.amount - b.amount,
    showSorterTooltip: false,
    render(amount) {
      return nDecimalFormat(amount, 8);
    },
  },
  {
    title: t('historypage.columns.total'),
    key: 'total',
    dataIndex: 'total',
    sorter: (a: any, b: any) => a.total - b.total,
    showSorterTooltip: false,
    render(filled, record: any) {
      const pairSplit = record.pair.split('_');
      return `${nDecimalFormat(filled, 2)} ${pairSplit[1]}`;
    },
  },
  {
    title: t('historypage.columns.filled'),
    key: 'tradeAmount',
    dataIndex: 'tradeAmount',
    sorter: (a: any, b: any) =>
      parseFloat(a.tradeAmount) / parseFloat(a.amount) - parseFloat(b.tradeAmount) / parseFloat(b.amount),
    showSorterTooltip: false,
    render(tradeAmount, record: any) {
      return (
        <span className="light">{numeral(parseFloat(tradeAmount) / parseFloat(record.amount)).format('0.00 %')}</span>
      );
    },
  },
  {
    title: t('historypage.columns.status'),
    key: 'state',
    dataIndex: 'state',
    width: 105,
    render(state) {
      return (
        <div className="light">
          <Space align="center">
            {state === 3 ? t('historypage.columns.finished') : t('historypage.columns.canceled')}
          </Space>
        </div>
      );
    },
  },
];

interface TOrderHistory {
  onChangePage: (page: number) => void;
}

export const OrderHistory: FC<TOrderHistory> = ({ onChangePage }) => {
  const { orderHistoryList, pageInfo, isLoadingHistory } = useAppSelector((state) => state.history);

  const { t } = useTranslation();

  const columns = useMemo(() => getColumns(t), [t]);

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={orderHistoryList}
          rowKey="orderId"
          columns={columns}
          pagination={false}
          size="small"
          loading={isLoadingHistory}
          scroll={{ x: true }}
        />
      </div>
      <div>
        {orderHistoryList && !!pageInfo?.countNumber && !!pageInfo?.pageSize ? (
          <PaginationForm total={pageInfo.countNumber} current={pageInfo.pageSize} onChange={onChangePage} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
