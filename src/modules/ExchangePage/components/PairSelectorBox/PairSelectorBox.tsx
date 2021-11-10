import { Surface } from 'components/Surface';
import React, { useState } from 'react';
import styles from './PairSelectorBox.module.css';
import PairSelectorPanel from './PairSelectorPanel';

const PairSelectorBox: React.FC = () => {
  type IFilterType = 'all' | 'watchlist' | 'fiat' | 'btc' | 'innovation';
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const [fiat, setFiat] = useState<any>(null);

  return (
    <Surface className={styles.root}>
      <PairSelectorPanel
        visible={true}
        convertData={[]}
        isDropdown={false}
        filterType={filterType}
        onChangeFilterType={setFilterType}
        fiat={fiat}
        onChangeFiat={setFiat}
      />
    </Surface>
  );
};

export default PairSelectorBox;
