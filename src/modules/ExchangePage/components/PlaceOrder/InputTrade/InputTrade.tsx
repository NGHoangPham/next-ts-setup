import { FC, memo } from 'react';
import { Surface } from 'components/Surface';
import styles from './InputTrade.module.css';
import { Input } from 'components/Input';
import { InputNumber } from 'antd';
import { fixed } from 'utils/number';

type InputTradeProps = {
  value?: number | undefined;
  coin: string;
  title: string;
  disabled?: boolean;
  onChange?: ((value: number) => void) | undefined;
  type?: string;
  text?: string;
  decimalAmount?: number;
};

// eslint-disable-next-line react/display-name
export const InputTrade: FC<InputTradeProps> = memo(
  ({ coin, value, title, disabled, onChange, type, text, decimalAmount }: InputTradeProps) => {
    return (
      <Surface className={styles.root}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>
          {type === 'text' ? (
            <Input value={text} className={styles.input} disabled={disabled} />
          ) : (
            <InputNumber
              value={decimalAmount && value ? Number(fixed('' + value, Number(decimalAmount))) : value}
              onChange={onChange}
              className={styles.input}
              disabled={disabled}
            />
          )}
          <span className={styles.coin}>{coin}</span>
        </div>
      </Surface>
    );
  }
);
