import { Input as AntdInput } from 'antd';
import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Input.module.css';
import { InputProps } from './types';

export const Input = forwardRef<AntdInput, InputProps>(function Input({ className, ...props }, ref) {
  return <AntdInput ref={ref} className={clsx(styles.root, props.size && styles[props.size], className)} {...props} />;
});
