import { FC, useEffect, useState, memo } from 'react';
import styles from '../PlaceOrder.module.css';
import { InputTrade } from '../InputTrade';
import { InputSlider } from '../InputSlider';
import { Checkbox } from 'components/Checkbox';
import { Button } from 'components/Button';
import { Toast } from 'components/Toast';
import { useAppSelector } from 'hooks';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import { fixed } from 'utils/number';
import { getOrderBookSelect } from 'store/ducks/exchange/slice';
import { useUser } from '@auth0/nextjs-auth0';

interface LimitOrderProps {
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
  makeOrder: boolean;
  price: number | undefined;
  amount: number | undefined;
  total: number | undefined;
  amountIceberg: number | undefined;
  slider: number;
}

export const LimitOrder: FC<LimitOrderProps> = memo(
  ({
    filterSide,
    available,
    moneyCoin,
    coin,
    coinLimit,
    coinDecimalAmount,
    moneyCoinDecimalAmount,
    refetch,
  }: LimitOrderProps) => {
    const { t } = useTranslation();
    const { user } = useUser();
    const orderBookSelect = useAppSelector(getOrderBookSelect);
    const [data, setData] = useState<Data>({
      iceberg: false,
      makeOrder: true,
      price: undefined,
      amount: undefined,
      total: undefined,
      amountIceberg: undefined,
      slider: 0,
    });

    const [slider, setSlider] = useState<number>(0);

    const [amountIceberg, setAmountIceberg] = useState(0);

    useEffect(() => {
      if (orderBookSelect?.price) {
        const priceSelect = orderBookSelect.price;
        const amountSelect = orderBookSelect.amount;
        setData({
          ...data,
          price: priceSelect,
          amount: amountSelect,
          total: amountSelect * priceSelect,
        });
        setSlider((amountSelect / maxAmount) * 100);
      }
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
      if (value >= maxAmount) {
        setData({
          ...data,
          amount: maxAmount,
          total: maxAmount * (data?.price || 0),
        });
      } else {
        setData({
          ...data,
          amount: value,
          total: value * (data?.price || 0),
        });
      }
    };

    const handleChangePrice = (value: number) => {
      setData({ ...data, price: value, total: value * (data?.amount || 0) });
    };

    const handleChangeTotal = (value: number) => {
      setData({ ...data, amount: value / (data?.price || 1), total: value });
    };

    const handleOrder = (isBuy: boolean) => {
      const orderData = {
        coin1: coin,
        coin2: moneyCoin,
        type: 'LIMIT',
        is_bid: isBuy,
        param1: Number(fixed('' + data.price, Number(moneyCoinDecimalAmount))),
        param2: Number(fixed('' + data.amount, Number(coinDecimalAmount))),
        param3: 0,
        pool: 1,
      };
      switch (true) {
        case !data.price:
          Toast('error', t('exchange.place_order.empty_price'));
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
          mutatePlaceOrderMarket(orderData);
      }
    };

    const handleLogin = () => {
      window.location.href = '/api/auth/login';
    };

    const maxAmount = filterSide === 'buy' && data.price ? available / data.price : available;

    return (
      <>
        <InputTrade
          value={data.price}
          onChange={(value) => {
            handleChangePrice(value);
          }}
          coin={moneyCoin}
          title={t('exchange.place_order.price')}
          decimalAmount={moneyCoinDecimalAmount}
        />
        <InputTrade
          value={data.amount}
          onChange={(value) => {
            handleChangeAmount(value);
            setSlider((value / maxAmount) * 100);
          }}
          coin={coin}
          title={t('exchange.place_order.amount')}
          decimalAmount={coinDecimalAmount}
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
            setSlider((value / (data?.price || 1) / maxAmount) * 100);
          }}
          coin={moneyCoin}
          title={t('exchange.place_order.total')}
          decimalAmount={moneyCoinDecimalAmount}
        />
        <div className={styles.checkbox}>
          <Checkbox
            checked={data.iceberg}
            onChange={() => {
              handleChangeData('iceberg', !data.iceberg);
            }}
          >
            {t('exchange.place_order.iceberg')}
          </Checkbox>
        </div>
        {data.iceberg && (
          <InputTrade
            value={amountIceberg}
            onChange={(value) => {
              setAmountIceberg(value);
            }}
            coin={coin}
            decimalAmount={coinDecimalAmount}
            title={t('exchange.place_order.amount')}
          />
        )}
        <div className={styles.checkbox}>
          <Checkbox
            checked={data.makeOrder}
            onChange={() => {
              handleChangeData('makeOrder', !data.makeOrder);
            }}
          >
            {t('exchange.place_order.make_order')}
          </Checkbox>
        </div>
        <div className={styles.buttonContainer}>
          {filterSide === 'buy' ? (
            <Button
              type="buy"
              className={styles.submitButton}
              onClick={() => (user ? handleOrder(true) : handleLogin())}
              loading={placeOrderStatus === 'loading'}
            >
              {user ? t('exchange.place_order.buy') + ' ' + coin : 'Login to trade'}
            </Button>
          ) : (
            <Button
              type="sell"
              className={styles.submitButton}
              onClick={() => (user ? handleOrder(false) : handleLogin())}
              loading={placeOrderStatus === 'loading'}
            >
              {user ? t('exchange.place_order.sell') + ' ' + coin : 'Login to trade'}
            </Button>
          )}
        </div>
      </>
    );
  }
);
