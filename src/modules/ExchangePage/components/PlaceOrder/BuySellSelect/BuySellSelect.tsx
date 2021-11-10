import { FC, CSSProperties } from 'react';
import styles from './BuySellSelect.module.css';
import { Radio, RadioGroupProps } from 'antd';
import clsx from 'clsx';

export interface filterValue {
  value?: 'buy' | 'sell';
  label?: string;
}

type BuySellSelectProps = Partial<RadioGroupProps> & {
  datas: filterValue[];
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
  value: string;
};

export const BuySellSelect: FC<BuySellSelectProps> = ({ datas, filled, className, style, value, ...props }) => {
  const renderClassName = (itemValue: string) => {
    if (value === 'buy' && itemValue === 'buy') return styles.buySelect;
    if (value === 'sell' && itemValue === 'sell') return styles.sellSelect;
    return styles.select;
  };
  return (
    <div className={clsx(styles.root, filled && styles.filled, className)} style={style}>
      <Radio.Group className={styles.filterWrapper} buttonStyle="solid" {...props}>
        {datas.map((item) => (
          <Radio.Button
            key={item.value}
            className={`${styles.filterItem} ${renderClassName(item.value || '')}`}
            value={item.value}
          >
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};
