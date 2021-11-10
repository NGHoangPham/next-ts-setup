import { Slider } from 'antd';
import { memo } from 'react';
import styles from './InputSlider.module.css';

interface SliderProps {
  value?: number | undefined;
  handleChange?: (value: number) => void;
  maxValue?: number;
}

// eslint-disable-next-line react/display-name
export const InputSlider = memo(({ value, handleChange, maxValue }: SliderProps) => {
  const marks = {
    0: 0,
    25: 1,
    50: 2,
    75: 3,
    100: 4,
  };

  return (
    <div className={styles.slider}>
      <Slider
        marks={marks}
        value={value}
        onChange={(e: number) => {
          if (handleChange) handleChange((e / 100) * (maxValue || 1));
        }}
        range={false}
        max={100}
        tipFormatter={(value: number | undefined) => {
          return `${value}%`;
        }}
      />
    </div>
  );
});
