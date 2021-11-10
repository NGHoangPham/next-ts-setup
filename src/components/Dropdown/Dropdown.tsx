import styles from './Dropdown.module.css';
import { Dropdown as AndtDropdown, DropDownProps } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';

export type ModifiedDropdownProps = Partial<DropDownProps> & {
  className?: string;
};

export const Dropdown: FC<ModifiedDropdownProps> = ({
  className,
  children,
  overlay = <></>,
  overlayStyle,
  overlayClassName,
  ...props
}) => {
  return (
    <AndtDropdown
      className={clsx(styles.dropdown, className)}
      overlayStyle={overlayStyle}
      overlay={overlay}
      overlayClassName={`${styles.overlay} ${overlayClassName}`}
      {...props}
    >
      {children}
    </AndtDropdown>
  );
};
