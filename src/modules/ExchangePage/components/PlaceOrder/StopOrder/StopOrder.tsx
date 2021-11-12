import { FC, useEffect, useState } from 'react';
import styles from '../PlaceOrder.module.css';
import { InputTrade } from '../InputTrade';
import { InputSlider } from '../InputSlider';
import { Checkbox } from 'components/Checkbox';
import { Button } from 'components/Button';
import { useAppSelector } from 'hooks';
import { Toast } from 'components/Toast';
import { OrderPlacePopup } from '../OrderPlacePopup';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import { fixed } from 'utils/number';

interface StopOrderProps {
  filterSide: 'buy' | 'sell';
  available: number;
  moneyCoin: string;
  coin: string;
  coinLimit: number;
  coinDecimalAmount: number;
  moneyCoinDecimalAmount: number;
  refetch: Function;
}

interface Data {
  iceberg: boolean;
  stop: number | undefined;
  limit: number | undefined;
  amount: number | undefined;
  total: number | undefined;
  amountIceberg: number | undefined;
}

export const StopOrder: FC<StopOrderProps> = ({
  filterSide,
  available,
  moneyCoin,
  coin,
  coinLimit,
  coinDecimalAmount,
  moneyCoinDecimalAmount,
  refetch,
}: StopOrderProps) => {
  const { t } = useTranslation();
  const isAuthenticated = true; // check later
  const { orderBookSelect } = useAppSelector((state) => state.exchange);
  const { currentPairValue } = useAppSelector((state) => state.exchange);
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<Data>({
    iceberg: false,
    stop: 0,
    limit: 0,
    amount: 0,
    total: 0,
    amountIceberg: 0,
  });
  const [slider, setSlider] = useState<number>(0);

  const orderData = {
    coin1: coin,
    coin2: moneyCoin,
    type: 'STOP',
    is_bid: filterSide === 'buy',
    param1: Number(fixed('' + data.stop, Number(moneyCoinDecimalAmount))),
    param2: Number(fixed('' + data.limit, Number(moneyCoinDecimalAmount))),
    param3: Number(fixed('' + data.amount, Number(coinDecimalAmount))),
    pool: 1,
  };

  useEffect(() => {
    if (orderBookSelect?.price) {
      const priceSelect = orderBookSelect.price;
      const amountSelect = orderBookSelect.amount;
      setData({
        ...data,
        stop: priceSelect,
        limit: priceSelect,
        amount: amountSelect,
        total: priceSelect * amountSelect,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBookSelect]);

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

  const handleChangeAmount = (value: number) => {
    setData({ ...data, amount: value, total: value * (data?.limit || 0) });
  };

  const handleChangeLimit = (value: number) => {
    setData({ ...data, limit: value, total: value * (data?.amount || 0) });
  };

  const handleChangeTotal = (value: number) => {
    setData({ ...data, amount: value / (data?.limit || 1), total: value });
  };

  const handleOrder = () => {
    switch (true) {
      case !data.stop:
        Toast('error', t('exchange.place_order.empty_stop'));
        break;
      case !data.limit:
        Toast('error', t('exchange.place_order.empty_limit'));
        break;
      case !data.amount:
        Toast('error', t('exchange.place_order.empty_amount'));
        break;
      case data.amount && data.amount < coinLimit:
        Toast('error', t('exchange.place_order.minimum_amount') + coinLimit);
        break;
      case filterSide === 'buy' && data?.total && data?.total > available:
        Toast('error', t('exchange.place_order.not_enough_balance'));
        break;
      case filterSide === 'sell' && data?.amount && data?.amount > available:
        Toast('error', t('exchange.place_order.not_enough_balance'));
        break;
      default:
        setVisible(true);
    }
  };
  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };
  const maxAmount = filterSide === 'buy' ? available / (data?.limit || 1) : available;

  return (
    <>
      {visible && (
        <OrderPlacePopup
          visible={visible}
          onCancel={() => setVisible(false)}
          stop={data.stop}
          limit={data.limit}
          amount={data.amount}
          side={filterSide}
          coin={coin}
          moneyCoin={moneyCoin}
          onConfirm={() => {
            mutatePlaceOrderMarket(orderData);
          }}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
        />
      )}
      <InputTrade
        value={data.stop}
        onChange={(value) => {
          handleChangeData('stop', value);
        }}
        coin={moneyCoin}
        decimalAmount={moneyCoinDecimalAmount}
        title={t('exchange.place_order.stop')}
        precision={currentPairValue?.[3]}
      />
      <InputTrade
        value={data.limit}
        onChange={(value) => {
          handleChangeLimit(value);
        }}
        coin={moneyCoin}
        decimalAmount={moneyCoinDecimalAmount}
        title={t('exchange.place_order.limit')}
        precision={currentPairValue?.[3]}
      />
      <InputTrade
        value={data.amount}
        onChange={(value) => {
          handleChangeAmount(value);
          setSlider((value / maxAmount) * 100);
        }}
        coin={coin}
        decimalAmount={coinDecimalAmount}
        title={t('exchange.place_order.amount')}
        precision={currentPairValue?.[2]}
      />
      <InputSlider
        value={slider}
        handleChange={(value: number) => {
          setSlider((value / maxAmount) * 100);
          handleChangeAmount(value);
        }}
        maxValue={maxAmount}
      />
      <InputTrade
        value={data.total}
        onChange={(value) => {
          handleChangeTotal(value);
          setSlider((value / (data?.limit || 1) / maxAmount) * 100);
        }}
        coin={moneyCoin}
        decimalAmount={moneyCoinDecimalAmount}
        title={t('exchange.place_order.total')}
        precision={currentPairValue?.[2]}
      />{' '}
      <div className={styles.checkbox}>
        <Checkbox
          checked={data.iceberg}
          onChange={() => {
            handleChangeData('iceberg', !data.iceberg);
          }}
        >
          Iceberg
        </Checkbox>
      </div>
      {data.iceberg && (
        <InputTrade
          value={data.amountIceberg}
          onChange={(value) => {
            handleChangeData('amountIceberg', value);
          }}
          coin={coin}
          decimalAmount={coinDecimalAmount}
          title={t('exchange.place_order.amount')}
        />
      )}
      <div className={styles.buttonContainer}>
        {filterSide === 'buy' ? (
          <Button
            type="buy"
            className={styles.submitButton}
            onClick={() => (isAuthenticated ? handleOrder() : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {isAuthenticated ? t('exchange.place_order.buy') + ' ' + coin : 'Login to trade'}
          </Button>
        ) : (
          <Button
            type="sell"
            className={styles.submitButton}
            onClick={() => (isAuthenticated ? handleOrder() : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {isAuthenticated ? t('exchange.place_order.sell') + ' ' + coin : 'Login to trade'}
          </Button>
        )}
      </div>
    </>
  );
};
