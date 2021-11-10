import { Avatar } from 'components/Avatar';
import { useState, useEffect } from 'react';
import { currencyImgs } from 'assets/images/currency';
import styles from './QuickOrder.module.css';
import { Button } from 'components/Button';
import { InputNumber } from 'antd';
import { Toast } from 'components/Toast';
import { useAppSelector, useAppDispatch } from 'hooks';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useWalletQuery } from 'api/wallet';
import { useTranslation } from 'next-i18next';
import { usePairListQuery } from 'api/pair_list';
import { fixed } from 'utils/number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { setExchange } from 'store/ducks/system/slice';

export const QuickOrder = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentPair } = useAppSelector((state) => state.system.exchange);
  const { listPairValue } = useAppSelector((state) => state.exchange);
  const { data, refetch }: any = useWalletQuery();
  const { data: pairs } = usePairListQuery();

  const [headerData, setHeaderData] = useState<any>(null);
  const [amount, setAmount] = useState<any>(0);

  const coin = currentPair?.split('_')[0];
  const moneyCoin = currentPair?.split('_')[1];

  const moneyCoinAvailable = data?.coins?.find((coinData: any) => coinData.coinType === moneyCoin)?.number || 0;
  const coinAvailable = data?.coins?.find((coinData: any) => coinData.coinType === coin)?.number || 0;

  const coinLimit = data?.coinsLimitMap[coin];

  const currentPairData = pairs?.find((pair: any) => pair[0] === currentPair);

  const coinDecimalAmount = Number((currentPairData && currentPairData[2]) || 0);

  useEffect(() => {
    let headerData = null;
    if (listPairValue.length > 0) {
      headerData = listPairValue.find((listPairValue_item: any) => listPairValue_item.pair === currentPair);
    }
    setHeaderData(headerData);
  }, [listPairValue, currentPair]);

  const { mutateAsync: mutatePlaceOrderMarket } = useMutation(placeOrderMarket, {
    onSuccess: () => {
      Toast('success', t('exchange.place_order.order_success'));
      refetch();
    },
    onError: (error: TError) => {
      Toast('error', error.message);
    },
  });

  const handleOrder = (isBuy: boolean) => {
    const orderData = {
      coin1: coin,
      coin2: moneyCoin,
      type: 'LIMIT',
      is_bid: isBuy,
      param1: isBuy ? headerData?.buy : headerData?.sell,
      param2: Number(fixed('' + amount, Number(coinDecimalAmount))),
      param3: 0,
      pool: 1,
    };
    switch (true) {
      case !amount:
        Toast('error', 'Please input amount');
        break;
      case amount < coinLimit:
        Toast('error', t('exchange.place_order.minimum_amount') + coinLimit);
        break;
      case isBuy && amount * headerData?.buy > moneyCoinAvailable:
        Toast('error', t('exchange.place_order.not_enough_balance'));
        break;
      case !isBuy && amount > coinAvailable:
        Toast('error', t('exchange.place_order.not_enough_balance'));
        break;
      default:
        mutatePlaceOrderMarket(orderData);
    }
  };

  const onClose = () => {
    dispatch(setExchange({ name: 'quickOrder', value: false }));
  };

  return (
    <div className={styles.root}>
      <FontAwesomeIcon color="#788686" icon={faTimesCircle} className={styles.btnClose} onClick={onClose} />
      <FontAwesomeIcon color="#788686" icon={faDotCircle} className={styles.btnDot} />
      <div className={styles.info}>
        <div className={styles.buyPrice}>{headerData?.buy}</div>
        <div className="currency">
          <Avatar size={24} type="secondary" src={currencyImgs && currencyImgs[coin]} />
          <span className="bold default">{coin}</span>
        </div>
        <div className={styles.sellPrice}>{headerData?.sell}</div>
      </div>
      <div className={styles.inputOrder}>
        <div className={styles.inputWrapper}>
          <Button type="buy" className={styles.buyButton} onClick={() => handleOrder(true)}>
            Buy
          </Button>
          <InputNumber
            value={coinDecimalAmount && amount ? Number(fixed('' + amount, Number(coinDecimalAmount))) : ''}
            placeholder={'Amount (' + coin + ')'}
            onChange={(value) => setAmount(value)}
            className={styles.inputAmount}
          />
          <Button type="sell" className={styles.sellButton} onClick={() => handleOrder(false)}>
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
};
