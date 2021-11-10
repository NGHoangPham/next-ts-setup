import { FC } from 'react';
import styles from './SelectWithLabel.module.css';
import clsx from 'clsx';

import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import { SurfaceLabel } from 'components/SurfaceLabel';

export type SelectProps = Partial<AntdSelectProps<any>> & {
  id?: string;
  label?: string;
};

const { Option } = AntdSelect;

const SelectWithLabel: FC<SelectProps> = ({
  label,
  id,
  // className,
  children,
  size = 'middle',
  ...props
}) => {
  const inputWithSize = styles[size];
  return (
    <SurfaceLabel id={id} label={label} size={size}>
      <AntdSelect dropdownClassName={styles.dropdown} className={clsx(styles.input, inputWithSize)} {...props}>
        {children}
      </AntdSelect>
    </SurfaceLabel>
  );
};

export { SelectWithLabel, Option };
