import React, { useState, useEffect } from 'react';
import styles from './PairSelector.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PairSelectorPanel from '../PairSelectorBox/PairSelectorPanel';
import { useAppSelector } from 'hooks';
import { currencyImgs } from 'assets/images/currency';

interface PairSelectorProps {
  convertData: any[];
}

const PairSelector: React.FC<PairSelectorProps> = ({ convertData }) => {
  const [showingDropdown, setShowingDropdown] = useState<boolean>(false);
  const { currentPair } = useAppSelector((state) => state.system.exchange);
  const [coinImage, setCoinImage] = useState(currencyImgs.GENERIC);
  type IFilterType = 'all' | 'watchlist' | 'fiat' | 'btc' | 'innovation';
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const [fiat, setFiat] = useState<any>(null);

  useEffect(() => {
    if (currentPair) {
      let splits = currentPair.split('_');
      setCoinImage(currencyImgs[splits[0]] || currencyImgs.GENERIC);
    } else {
      setCoinImage(currencyImgs.GENERIC);
    }
  }, [currentPair]);

  return (
    <div className={styles.wrapper}>
      {showingDropdown && (
        <div
          className={styles.blur}
          onClick={() => {
            setShowingDropdown(false);
          }}
        />
      )}
      <div className={styles.symbolWrap}>
        <div
          className={styles.symbol}
          onClick={() => {
            setShowingDropdown(true);
          }}
        >
          <img alt="coin" className={styles.coinImage} src={coinImage} />
          <label className={styles.symbolLabel}>{currentPair ? currentPair.replace('_', '/') : '__/__'}</label>
          <button type="button" className={styles.iconChevronDown}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>

        {showingDropdown && (
          <PairSelectorPanel
            visible={showingDropdown}
            onClose={() => {
              setShowingDropdown(false);
            }}
            isDropdown={true}
            convertData={convertData}
            filterType={filterType}
            onChangeFilterType={setFilterType}
            fiat={fiat}
            onChangeFiat={setFiat}
          />
        )}
      </div>
    </div>
  );
};

export default PairSelector;
