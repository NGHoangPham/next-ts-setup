import { FC } from 'react';
import { ActionBanners } from './components/ActionBanners';
import { BuyTable } from './components/BuyTable';
import { Hero } from './components/Hero';
// import { PriceCharts } from 'components/PriceCharts';
import { Why } from './components/Why';
import styles from './styles.module.css';

import dynamic from 'next/dynamic';
const PriceCharts = dynamic(() => import('components/PriceCharts').then((mod) => mod.PriceCharts as any), {
  ssr: false,
});

const HomePage: FC = () => {
  return (
    <div className={styles.root}>
      <Hero />
      <PriceCharts />
      <ActionBanners />
      <Why />
      <BuyTable />
    </div>
  );
};

export default HomePage;
