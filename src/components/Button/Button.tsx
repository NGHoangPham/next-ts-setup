import { Button as ButtonAntd } from 'antd';
import clsx from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';
import styles from './Button.module.css';
import { ButtonProps } from './types';

export const Button = forwardRef<HTMLElement, PropsWithChildren<ButtonProps>>(function Button(
  { children, type = 'default', size = 'middle', htmlType = 'button', className, disabled, loading, onClick },
  ref
) {
  return (
    <ButtonAntd
      htmlType={htmlType}
      className={clsx(styles.root, styles[type], styles[size], className)}
      ref={ref}
      type={type === 'primary' || type === 'secondary' ? 'primary' : undefined}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
      {children}
    </ButtonAntd>
  );
});
