import { FC } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { Select, SelectProps } from 'components/Select';

interface InputWithSelectProps {
  inputProps?: NumberFormatProps;
  selectProps?: SelectProps;
  className?: string;
  invalid?: boolean;
}

export const InputWithSelect: FC<InputWithSelectProps> = ({
  children,
  inputProps,
  selectProps,
  className,
  invalid,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      <Select {...selectProps}>{children}</Select>
      <NumberFormat
        allowNegative={false}
        thousandSeparator
        className={clsx('ant-input', styles.input, invalid && styles.invalid)}
        {...inputProps}
      />
    </div>
  );
};

export const Option = Select.Option;
