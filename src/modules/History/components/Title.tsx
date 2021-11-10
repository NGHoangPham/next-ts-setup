import { FC, useState } from 'react';
import { Typography } from 'antd';
import { FilterGroup } from 'components/FilterGroup';
import { Space } from 'antd';
import { useTranslation } from 'next-i18next';

const Title: FC = () => {
  type TFilterType = 'orders' | 'deposit' | 'purchase' | 'login';
  const [filterType, setFilterType] = useState<TFilterType>('orders');
  const { t } = useTranslation();
  return (
    <div>
      <Typography.Title level={2}>{t('historypage.title.title')}</Typography.Title>
      <Space size={20}>
        <FilterGroup
          datas={[
            { label: t('historypage.title.orders'), value: 'orders' },
            {
              label: t('historypage.title.deposit'),
              value: 'deposit',
            },
            { label: t('historypage.title.purchase'), value: 'purchase' },
            { label: t('historypage.title.login'), value: 'login' },
          ]}
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
          }}
        />
      </Space>
    </div>
  );
};

export default Title;
