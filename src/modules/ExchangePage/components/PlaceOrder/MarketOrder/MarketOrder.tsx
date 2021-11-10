import { FC, useState } from 'react';
import styles from '../PlaceOrder.module.css';
import { InputTrade } from '../InputTrade';
import { InputSlider } from '../InputSlider';
import { Button } from 'components/Button';
import { Toast } from 'components/Toast';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import { fixed } from 'utils/number';
import { useAppSelector } from 'hooks/reduxHook';
import { getListPairValue } from 'store/ducks/exchange/slice';

interface MarketOrderProps {
  filterSide: 'buy' | 'sell';
  available: number;
  moneyCoin: string;
  coin: string;
  coinLimit: number;
  coinDecimalAmount: number;
  refetch: Function;
}
interface Data {
  price: number | undefined;
  total: number | undefined;
}

export const MarketOrder: FC<MarketOrderProps> = ({
  filterSide,
  available,
  moneyCoin,
  coin,
  coinLimit,
  coinDecimalAmount,
  refetch,
}: MarketOrderProps) => {
  const { t } = useTranslation();
  const isAuthenticated = true; // check later
  const [data, setData] = useState<Data>({
    price: undefined,
    total: undefined,
  });

  const [slider, setSlider] = useState<number>(0);

  const { currentPair } = useAppSelector((state) => state.system.exchange);
  const listPairValue = useAppSelector(getListPairValue);
  const pairData = listPairValue.find((listPairValue_item: any) => listPairValue_item.pair === currentPair);
  const { mutateAsync: mutatePlaceOrderMarket, status: placeOrderStatus } = useMutation(placeOrderMarket, {
    onSuccess: () => {
      Toast('success', t('exchange.place_order.order_success'));
      refetch();
    },
    onError: (error: TError) => {
      Toast('error', error.message);
    },
  });

  const handleChangeData = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  const handleOrder = (isBuy: boolean) => {
    const orderData = {
      coin1: coin,
      coin2: moneyCoin,
      type: 'MARKET',
      is_bid: isBuy,
      param1: Number(pairData?.last),
      param2: Number(fixed('' + data.total, Number(coinDecimalAmount))),
      param3: 0,
      pool: 1,
    };
    switch (true) {
      case !data.total:
        Toast('error', t('exchange.place_order.empty_total'));
        break;
      case data.total && data.total < coinLimit:
        Toast('error', t('exchange.place_order.minimum_amount') + coinLimit);
        break;
      case data?.total && data?.total > available:
        Toast('error', t('exchange.place_order.not_enough_balance'));
        break;
      default:
        mutatePlaceOrderMarket(orderData);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const maxAmount = filterSide === 'buy' && pairData.buy ? available / pairData.buy : available;
  return (
    <>
      <InputTrade text={'Market'} type="text" coin={moneyCoin} title={t('exchange.place_order.price')} disabled />{' '}
      <InputTrade
        value={data.total}
        onChange={(value) => {
          handleChangeData('total', value);
          setSlider((value / maxAmount) * 100);
        }}
        coin={coin}
        title={t('exchange.place_order.total')}
        decimalAmount={coinDecimalAmount}
      />
      <InputSlider
        value={slider}
        handleChange={(value: number) => {
          setSlider((value / maxAmount) * 100);
          handleChangeData('total', value);
        }}
        maxValue={maxAmount}
      />
      <div className={styles.buttonContainer}>
        {filterSide === 'buy' ? (
          <Button
            type="buy"
            className={styles.submitButton}
            onClick={() => (isAuthenticated ? handleOrder(true) : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {isAuthenticated ? t('exchange.place_order.buy') + ' ' + coin : 'Login to trade'}
          </Button>
        ) : (
          <Button
            type="sell"
            className={styles.submitButton}
            onClick={() => (isAuthenticated ? handleOrder(false) : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {isAuthenticated ? t('exchange.place_order.sell') + ' ' + coin : 'Login to trade'}
          </Button>
        )}
      </div>
    </>
  );
};
