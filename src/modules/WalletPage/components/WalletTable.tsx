import { FC } from 'react';
import { Table, Typography, Space, Menu } from 'antd';
import styles from './WalletTable.module.css';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/Button';
import { useTranslation } from 'next-i18next';
import { WalletTableItem } from 'api/wallet/types';
import { usePairListQuery } from 'api/pair_list';
import { nDecimalFormat } from 'utils/number';
import { Dropdown } from 'components/Dropdown';
import { currencyImgs } from 'assets/images/currency';
import { Avatar } from 'components/Avatar';
import { DISABLE_COIN, NUMBER_ROUND } from '../constants';
import { coinName } from 'utils/currency';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
interface WalleTableProps {
  tableData: Array<WalletTableItem>;
}

const WalletTable: FC<WalleTableProps> = ({ tableData }) => {
  const { t } = useTranslation();
  const { data: pair_list } = usePairListQuery();
  const router = useRouter();

  const renderColumnCoin = (coin: string) => (
    <Space>
      <Space align="center">
        <Avatar type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} size={22} />
        <Typography.Text className="bold">{coin}</Typography.Text>
      </Space>
      <Typography.Text className={styles.coinName}>{coinName[coin] ? coinName[coin] : coin}</Typography.Text>
    </Space>
  );

  const checkTradePair = (item: WalletTableItem) => {
    if (DISABLE_COIN.includes(item.coinType || '')) {
      return true;
    }
    return false;
  };

  const menu = (i: WalletTableItem) => {
    let list: any = [];
    pair_list?.forEach((item: any) => {
      const pair1 = item[0].split('_')[0];
      const pair2 = item[0].split('_')[1];
      if (item[0].includes(i.coinType) && !DISABLE_COIN.includes(pair1) && !DISABLE_COIN.includes(pair2)) {
        list.push(item[0]);
      }
    });
    return (
      <Menu>
        {list.length > 0 ? (
          list.map((item: object, index: number) => (
            <Menu.Item key={index} onClick={() => router.push(routes.trade)}>
              <span>{item} </span>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item>
            <span>{t('walletpage.wallet_table.coin_block_empty')}</span>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const renderActionColumn = (item: WalletTableItem) => (
    <Space>
      <Button type="info" size="small" onClick={() => router.push(routes.trade)}>
        {t('walletpage.wallet_table.buy')}
      </Button>
      <Button type="primary" size="small" onClick={() => router.push(routes.deposit)}>
        {t('walletpage.wallet_table.deposit')}
      </Button>
      <Button size="small" onClick={() => router.push(routes.deposit)}>
        {t('walletpage.wallet_table.withdraw')}
      </Button>
      <Dropdown overlay={menu(item)} className={styles.dropDown}>
        <div className={styles.dropdownWrapper}>
          <Button type="blue" size="small" disabled={checkTradePair(item)}>
            {t('walletpage.wallet_table.trade')}
          </Button>
        </div>
      </Dropdown>
    </Space>
  );

  const columns: ColumnsType<WalletTableItem> = [
    {
      title: t('walletpage.wallet_table.coin'),
      key: 'coinType',
      sorter: (a: WalletTableItem, b: WalletTableItem) => a.coinType.localeCompare(b.coinType),
      showSorterTooltip: false,
      dataIndex: 'coinType',
      render(coin: string) {
        return renderColumnCoin(coin);
      },
    },
    {
      title: t('walletpage.wallet_table.total'),
      key: 'totalNumber',
      dataIndex: 'totalNumber',
      sorter: (a: any, b: any) => a.totalNumber - b.totalNumber,
      showSorterTooltip: false,
      render(total: string) {
        return nDecimalFormat(total, NUMBER_ROUND);
      },
    },
    {
      title: t('walletpage.wallet_table.inuse'),
      key: 'lockNumber',
      sorter: (a: any, b: any) => a.lockNumber - b.lockNumber,
      showSorterTooltip: false,
      dataIndex: 'lockNumber',
      render(inuse: string) {
        return nDecimalFormat(inuse, NUMBER_ROUND);
      },
    },
    {
      title: t('walletpage.wallet_table.available'),
      key: 'number',
      sorter: (a: any, b: any) => a.number - b.number,
      showSorterTooltip: false,
      dataIndex: 'number',
      render(available: string) {
        return nDecimalFormat(available, NUMBER_ROUND);
      },
    },
    {
      title: t('walletpage.wallet_table.value'),
      key: 'assessment',
      dataIndex: 'assessment',
      sorter: (a: any, b: any) => a.assessment - b.assessment,
      showSorterTooltip: false,
      render(assessment: string) {
        return `$ ${nDecimalFormat(assessment, NUMBER_ROUND)}`;
      },
    },
    {
      title: t('walletpage.wallet_table.action'),
      key: 'actions',
      align: 'right',
      colSpan: 5,
      render(item) {
        return renderActionColumn(item);
      },
    },
  ];
  return (
    <div className={styles.root}>
      <div className={styles.table}>
        <Table columns={columns} dataSource={tableData} rowKey="id" pagination={false} size="small" />
      </div>
    </div>
  );
};

export default WalletTable;
