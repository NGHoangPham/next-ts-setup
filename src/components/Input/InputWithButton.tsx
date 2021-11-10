import clsx from 'clsx';
import { Button, ButtonProps } from 'components/Button';
import { FC, ReactNode } from 'react';
import { Input } from './Input';
import styles from './InputWithButton.module.css';
import { InputProps } from './types';

type InputWithButtonProps = Omit<InputProps, 'className'> & {
  buttonProps?: Omit<ButtonProps, 'size'>;
  inputProps?: InputProps;
  enterButton: ReactNode;
  className?: string;
};

export const InputWithButton: FC<InputWithButtonProps> = ({
  enterButton,
  inputProps,
  buttonProps,
  className,
  ...props
}) => {
  return (
    <div className={styles.root}>
      <Input className={clsx(styles.input, inputProps?.className)} {...props} />
      <Button type="primary" {...buttonProps} className={clsx(buttonProps?.className, className)} size={props.size}>
        {enterButton}
      </Button>
    </div>
  );
};
