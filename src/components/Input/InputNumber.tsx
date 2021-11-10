import { InputNumber as AntdInputNumber } from 'antd';
import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Input.module.css';
import { InputNumberProps } from './types';

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  { className, ...props },
  ref
) {
  return (
    <AntdInputNumber
      ref={ref}
      className={clsx(styles.root, styles.inputNumber, props.size && styles[props.size], className)}
      {...props}
    />
  );
});
