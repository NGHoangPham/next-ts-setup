import { CSSProperties, FC } from 'react';
import styles from './styles.module.css';
import { Space } from 'antd';
import { Triangle } from 'components/Triangle';
import clsx from 'clsx';

enum priceStatus {
  up = 'up',
  down = 'down',
  stable = 'stable',
}
const getStatus = (rate: number) => {
  if (rate > 0) {
    return priceStatus.up;
  } else if (rate < 0) {
    return priceStatus.down;
  }
  return priceStatus.stable;
};
interface PercentIndicatorProps {
  value: string; // with percent
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const PercentIndicator: FC<PercentIndicatorProps> = ({ value, transparent, className, style }) => {
  let formattedVal = value.slice(0, -1); // remove "%"
  const isPositive = formattedVal[0] !== '-';
  const status = getStatus(parseFloat(formattedVal));

  return (
    <Space
      style={style}
      className={clsx(
        styles.root,
        styles.priceWrapper,
        isPositive ? styles.priceUp : styles.priceDown,
        status === priceStatus.stable && styles.priceStable,
        transparent && styles.transparent,
        className
      )}
    >
      <Triangle size="middle" active={status === priceStatus.up} stable={status === priceStatus.stable} />
      <Space size={4}>
        <span>{isPositive ? formattedVal : formattedVal.substring(1)}</span>
        <span className={styles.percent}>%</span>
      </Space>
    </Space>
  );
};
