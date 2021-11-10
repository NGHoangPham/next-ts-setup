import { Children, FC, useRef } from 'react';
import styles from './styles.module.css';
import { Button, Carousel as AntdCarousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/lib/carousel';
import { CSSProperties } from 'react';
import clsx from 'clsx';
import { useState } from 'react';

interface CarouselProps {
  className?: string;
  styles?: CSSProperties;
}

export const Carousel: FC<CarouselProps> = ({ className, children }) => {
  const carouselRef = useRef<CarouselRef>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const numOfChildren = Children.count(children);
  const goNext = () => {
    carouselRef.current?.next();
    const nextIdx = activeIdx === numOfChildren - 1 ? 0 : activeIdx + 1;
    setActiveIdx(nextIdx);
  };
  const goPrev = () => {
    carouselRef.current?.prev();
    const prevIdx = activeIdx === 0 ? numOfChildren - 1 : activeIdx - 1;
    setActiveIdx(prevIdx);
  };

  const carouselProps = {
    dots: false,
    beforeChange: () => {},
  };

  const handleDotClick = (idx: number) => {
    carouselRef.current?.goTo(idx);
    setActiveIdx(idx);
  };

  return (
    <div className={clsx(styles.carouselContainer, className)}>
      <Button icon={<LeftOutlined />} shape="circle" type="text" size="large" onClick={goPrev} className="primary" />
      <div className={styles.carousel}>
        <AntdCarousel ref={carouselRef} {...carouselProps}>
          {children}
        </AntdCarousel>

        <div className={styles.dotWrapper}>
          {[...Array(numOfChildren).keys()].map((dotIdx) => (
            <div
              onClick={() => handleDotClick(dotIdx)}
              className={clsx(styles.dot, activeIdx === dotIdx && styles.dotActive)}
              key={dotIdx}
            />
          ))}
        </div>
      </div>
      <Button icon={<RightOutlined />} shape="circle" type="text" size="large" onClick={goNext} className="primary" />
    </div>
  );
};
