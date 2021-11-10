import React, { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { Avatar as AntdAvatar, AvatarProps } from 'antd';
import clsx from 'clsx';

export type ModifiedCheckboxProps = Partial<AvatarProps> & {
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary' | 'secondary';
};

export const Avatar = forwardRef<HTMLInputElement, PropsWithChildren<ModifiedCheckboxProps>>(function Avatar(
  { className, style, type = 'primary', children, ...props },
  ref
) {
  return (
    <AntdAvatar ref={ref} className={clsx(styles.root, styles[type], className)} style={style} {...props}>
      {children}
    </AntdAvatar>
  );
});
