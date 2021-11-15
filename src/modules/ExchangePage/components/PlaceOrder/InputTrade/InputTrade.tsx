import { FC, memo, useMemo } from 'react';
import { Surface } from 'components/Surface';
import styles from './InputTrade.module.css';
import { Input } from 'components/Input';
import { InputNumber, Row, Col } from 'antd';
import { fixed, nDecimalFormatAdvance } from 'utils/number';

type InputTradeProps = {
  value?: number | undefined;
  coin: string;
  title: string;
  disabled?: boolean;
  onChange?: ((value: number) => void) | undefined;
  type?: string;
  text?: string;
  decimalAmount?: number;
  precision?: number | undefined;
};

// eslint-disable-next-line react/display-name
export const InputTrade: FC<InputTradeProps> = memo(
  ({ coin, value, title, disabled, onChange, type, text, decimalAmount, precision }: InputTradeProps) => {
    const step = useMemo(() => {
      let value = precision;
      return value ? 1 / Math.pow(10, value) : undefined;
    }, [precision]);

    const formatter = useMemo(() => {
      return (value: any) => {
        return nDecimalFormatAdvance('' + value, precision ?? 2, {
          isNoZero: true,
        });
      };
    }, [precision]);

    return (
      <Surface className={styles.root}>
        <Row align="middle" justify="space-between">
          <Col span={4} className={styles.title}>
            {title}
          </Col>
          <Col span={20} className={styles.value}>
            {type === 'text' ? (
              <Input value={text} className={styles.input} disabled={disabled} />
            ) : (
              <InputNumber
                value={decimalAmount && value ? Number(fixed('' + value, Number(decimalAmount))) : value}
                onChange={onChange}
                className={styles.input}
                disabled={disabled}
                min={0}
                step={step}
                formatter={formatter}
              />
            )}
            <span className={styles.coin}>{coin}</span>
          </Col>
        </Row>
      </Surface>
    );
  }
);
