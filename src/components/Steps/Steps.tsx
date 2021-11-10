import { CSSProperties, FC } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

import { Steps as AntdSteps, StepsProps as AntdStepsProps } from 'antd';

type StepsProps = Partial<AntdStepsProps> & {
  className?: string;
  style?: CSSProperties;
};

export const Steps: FC<StepsProps> & { Step: typeof AntdSteps.Step } = ({ children, className, ...props }) => {
  return (
    <AntdSteps className={clsx(styles.root, className)} {...props}>
      {children}
    </AntdSteps>
  );
};

Steps.Step = AntdSteps.Step;
