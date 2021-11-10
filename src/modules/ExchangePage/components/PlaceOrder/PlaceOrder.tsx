/* eslint-disable react/display-name */
import { FC, useState, memo, useMemo, useEffect } from 'react';
import { Surface } from 'components/Surface';
import { Space, Typography } from 'antd';
import styles from './PlaceOrder.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FilterGroup } from 'components/FilterGroup';
import { BuySellSelect } from './BuySellSelect';
import { LimitOrder } from './LimitOrder';
import { MarketOrder } from './MarketOrder';
import { StopOrder } from './StopOrder';
import { useAppSelector, useAppDispatch } from 'hooks';
import { setOrderBookSelect, getCurrentPairValue } from 'store/ducks/exchange/slice';
import { getOrderBookSelect } from 'store/ducks/exchange/slice';
import { nDecimalFormat } from 'utils/number';
import { usePairListQuery } from 'api/pair_list';
import { useTranslation } from 'next-i18next';
import { useWalletQuery } from 'api/wallet';
import { getCurrentPair } from 'store/ducks/system/slice';

const { Text } = Typography;

type IFilterSide = 'buy' | 'sell';
type IFilterType = 'limit' | 'market' | 'stop';

const PlaceOrder: FC = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: walletData, refetch }: any = useWalletQuery({
    enabled: false,
  });

  const [filterSide, setFilterSide] = useState<IFilterSide>('buy');
  const [filterType, setFilterType] = useState<IFilterType>('limit');

  const orderBookSelect = useAppSelector(getOrderBookSelect);
  const currentPair = useAppSelector(getCurrentPair);
  const currentPairValue = useAppSelector(getCurrentPairValue);
  const { data: pairs } = usePairListQuery();

  const coin = useMemo(() => currentPair?.split('_')[0], [walletData, currentPair]);

  const moneyCoin = useMemo(() => currentPair?.split('_')[1], [walletData, currentPair]);

  const coinAvailable = useMemo(
    () =>
      walletData?.coins?.find((coinData: any) => {
        return coinData.coinType === coin;
      })?.number || 0,
    [walletData, currentPair]
  );

  const moneyCoinAvailable = useMemo(
    () => walletData?.coins?.find((coinData: any) => coinData.coinType === moneyCoin)?.number || 0,
    [walletData, currentPair]
  );
  const currentPairData = useMemo(() => pairs?.find((pair: any) => pair[0] === currentPair), [walletData, currentPair]);

  const coinDecimalAmount = useMemo(
    () => Number((currentPairData && currentPairData[2]) || 0),
    [walletData, currentPair]
  );
  const moneyCoinDecimalAmount = useMemo(
    () => Number((currentPairData && currentPairData[3]) || 0),
    [walletData, currentPair]
  );

  const coinLimit = useMemo(() => walletData?.coinsLimitMap[coin], [walletData, currentPair]);

  useEffect(() => {
    if (orderBookSelect.type) {
      switch (orderBookSelect.type) {
        case 'asks':
          setFilterSide('buy');
          break;
        case 'bids':
          setFilterSide('sell');
          break;
        default:
          break;
      }
    }
  }, [orderBookSelect]);

  return (
    <Surface className={styles.root}>
      <BuySellSelect
        datas={[
          { label: t('exchange.place_order.buy_uppercase'), value: 'buy' },
          { label: t('exchange.place_order.sell_uppercase'), value: 'sell' },
        ]}
        value={filterSide}
        onChange={(e) => {
          setFilterSide(e.target.value);
        }}
        className={styles.filterGroup}
      />
      <Space size={8} align="center" className={styles.available}>
        <div>
          <FontAwesomeIcon icon={faWallet} color="#788686" className={styles.walletIcon} />
          <Text type="secondary" className={styles.walletText}>
            {t('exchange.place_order.available')}
          </Text>
        </div>
        <div>
          <Text type="secondary">
            {filterSide === 'buy'
              ? `${nDecimalFormat(moneyCoinAvailable, currentPairValue?.[3] ?? 2)} ${moneyCoin || ''} `
              : `${nDecimalFormat(coinAvailable, currentPairValue?.[2] ?? 2)} ${coin || ''} `}
          </Text>
        </div>
      </Space>
      <FilterGroup
        datas={[
          { label: t('exchange.place_order.limit_uppercase'), value: 'limit' },
          {
            label: t('exchange.place_order.market_uppercase'),
            value: 'market',
          },
          { label: t('exchange.place_order.stop_uppercase'), value: 'stop' },
        ]}
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          dispatch(setOrderBookSelect({}));
        }}
        className={styles.filter}
      />
      {filterType === 'limit' && (
        <LimitOrder
          filterSide={filterSide}
          available={filterSide === 'buy' ? moneyCoinAvailable : coinAvailable}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
          refetch={refetch}
        />
      )}
      {filterType === 'market' && (
        <MarketOrder
          filterSide={filterSide}
          available={filterSide === 'buy' ? moneyCoinAvailable : coinAvailable}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
          refetch={refetch}
        />
      )}
      {filterType === 'stop' && (
        <StopOrder
          filterSide={filterSide}
          available={filterSide === 'buy' ? moneyCoinAvailable : coinAvailable}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
          refetch={refetch}
        />
      )}
    </Surface>
  );
});

export default PlaceOrder;
