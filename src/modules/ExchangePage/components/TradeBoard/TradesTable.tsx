import { FC, useState, useEffect } from 'react';
import { Table } from 'antd';
import { Surface } from 'components/Surface';
import styles from './OrderBookTable.module.css';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from 'hooks';
import { nDecimalFormat } from 'utils/number';
import moment from 'moment';
import { getCurrentPairValue, getTradesData, setOrderBookSelect } from 'store/ducks/exchange/slice';

const columns: any[] = [
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
    render: (text: any) => {
      return text;
    },
  },
  {
    title: 'Time',
    key: 'time',
    dataIndex: 'time',
    align: 'right',
    render: (text: any) => {
      return text;
    },
  },
];

export const TradesTable: FC = () => {
  const [headerDatatables] = useState<any[]>([]);
  const [datatables, setDatatables] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const renderRowClassName = (record: any) => {
    return record.increment == 'true' ? styles.rowBuy : styles.rowSell;
  };

  const tradesData = useAppSelector(getTradesData);
  const currentPairValue = useAppSelector(getCurrentPairValue);

  useEffect(() => {
    let history = tradesData.history;

    let dataHistory: any[] = [];

    history.forEach((item: any, index: number) => {
      dataHistory.push({
        id: index,
        price: nDecimalFormat('' + item[1], currentPairValue?.[3] ?? 2),
        amount: nDecimalFormat('' + item[2], currentPairValue?.[2] ?? 2),
        time: moment(parseInt(item[3])).format('HH:mm:ss'),
        increment: item[4],
      });
    });
    setLoading(false);

    setDatatables(dataHistory);
  }, [tradesData]);

  useEffect(() => {
    if (tradesData.history.length === 0) setLoading(true);
  }, []);

  return (
    <Surface className={styles.root} borderLess>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <Table dataSource={headerDatatables} columns={columns} size="small" />
        </div>
        <div className={clsx(styles.tableTrades, styles.scroll)}>
          <Table
            dataSource={datatables}
            rowKey="id"
            columns={columns}
            pagination={false}
            size="small"
            showHeader={false}
            loading={loading}
            rowClassName={(record: any) => renderRowClassName(record)}
            onRow={(record: any) => {
              return {
                onClick: () => {
                  let data: any = {};
                  data.price = record.price;
                  data.amount = record.amount;
                  data.type = record.increment === 'true' ? 'asks' : 'bids';
                  dispatch(setOrderBookSelect(data));
                },
              };
            }}
          />
        </div>
      </div>
    </Surface>
  );
};
