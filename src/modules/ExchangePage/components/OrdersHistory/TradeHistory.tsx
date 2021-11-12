import { FC } from 'react';
import { Space, Table } from 'antd';
import dayjs from 'dayjs';
import { nDecimalFormat, nDecimalFormatNoZero } from 'utils/number';
import styles from './OrdersHistory.module.css';
import { Avatar } from 'components/Avatar';
import { ColumnsType } from 'antd/lib/table';
import { currencyImgs } from 'assets/images/currency';
import { THistoryData } from 'api/history';
import { PaginationForm } from 'components/Pagination/Pagination';
import { useAppSelector } from 'hooks';
import { useTranslation } from 'next-i18next';
import { Button } from 'components/Button';
import { useUser } from '@auth0/nextjs-auth0';

interface TTradeHistory {
  onChangePage: (page: number) => void;
  precisionsConfigs: any;
}
const TradeHistory: FC<TTradeHistory> = ({ onChangePage, precisionsConfigs }) => {
  const { tradeHistoryList, pageInfo, isLoadingHistory } = useAppSelector((state) => state.history);
  const { t } = useTranslation();
  const { user } = useUser();

  const columns: ColumnsType<THistoryData> = [
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
      dataIndex: 'sell',
      render(side) {
        return <span className={!side ? 'success' : 'error'}>{side ? ' Sell' : 'Buy'}</span>;
      },
    },
    {
      title: t('historypage.columns.price'),
      key: 'price',
      dataIndex: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
      showSorterTooltip: false,
      render(price, record: any) {
        const pairSplit = record?.pair?.split('_');
        return record.orderType === 'MARKET'
          ? 'Market Price'
          : nDecimalFormat(price, precisionsConfigs?.[record.pair]?.money ?? 8) + (pairSplit ? ` ${pairSplit[1]}` : '');
      },
    },
    {
      title: t('historypage.columns.amount'),
      key: 'amount',
      dataIndex: 'amount',
      sorter: (a: any, b: any) => a.amount - b.amount,
      showSorterTooltip: false,
      render(amount, item: any) {
        const pairSplit = item?.pair?.split('_');
        return (
          nDecimalFormatNoZero(amount, precisionsConfigs?.[item.pair]?.coin ?? 8, 2) +
          (pairSplit ? ` ${pairSplit[0]}` : '')
        );
      },
    },
    {
      title: t('historypage.columns.total'),
      key: 'total',
      dataIndex: 'total',
      sorter: (a: any, b: any) => a.total - b.total,
      showSorterTooltip: false,
      render(total, record: any) {
        const pairSplit = record?.pair?.split('_');
        return `${nDecimalFormat(total, precisionsConfigs?.[record.pair]?.money ?? 8)} ${
          pairSplit ? pairSplit[1] : ''
        }`;
      },
    },
  ];

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={tradeHistoryList}
          rowKey="tradeId"
          columns={columns}
          pagination={false}
          size="small"
          loading={user ? isLoadingHistory : false}
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
      <div>
        {user && !isLoadingHistory && tradeHistoryList && !!pageInfo?.countNumber && !!pageInfo?.pageSize ? (
          <PaginationForm total={pageInfo.countNumber} current={pageInfo.pageSize} onChange={onChangePage} />
        ) : null}
      </div>
    </div>
  );
};

export default TradeHistory;
