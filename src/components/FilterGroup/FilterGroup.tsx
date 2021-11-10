import { FC, CSSProperties } from 'react';
import styles from './styles.module.css';
import { Radio, RadioGroupProps } from 'antd';
import clsx from 'clsx';

export interface filterValue {
  value?: any;
  label?: any;
}

type FilterGroupProps = Partial<RadioGroupProps> & {
  datas: filterValue[];
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const FilterGroup: FC<FilterGroupProps> = ({ datas, filled, className, style, ...props }) => {
  return (
    <div className={clsx(styles.root, filled && styles.filled, className)} style={style}>
      <Radio.Group className={styles.filterWrapper} buttonStyle="solid" {...props}>
        {datas.map((item) => (
          <Radio.Button key={item.value} className={styles.filterItem} value={item.value}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};
