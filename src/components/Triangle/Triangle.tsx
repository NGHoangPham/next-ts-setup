import clsx from 'clsx';
import { CSSProperties, FC } from 'react';
import styles from './Triangle.module.css';

interface TriangleProps {
  active?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: CSSProperties;
  stable?: boolean;
}

export const Triangle: FC<TriangleProps> = ({ active = true, size = 'large', className, style, stable = false }) => {
  return (
    <div style={style} className={stable ? styles.stableContainer : clsx(styles.root, !active && styles.rotate)}>
      <div
        className={clsx(
          stable ? styles.stable : styles.triangle,
          styles[size],
          className,
          active ? styles.success : styles.error
        )}
      />
    </div>
  );
};
