/* eslint-disable global-require */
import { FC, useEffect, useState } from 'react';
import styles from './ActionBanners.module.css';
import commonStyles from './common.module.css';

import { Col, message, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import {
  TGetDigitalCoin,
  TGetDigitalFiat,
  useGetCreditCoins,
  useGetCreditFiats,
  getFiatCurrency,
  TLimitFiat,
  getLimitFiat,
  TResponseLimit,
} from 'api/get_credit';

import { currencyImgs } from 'assets/images/currency';
import { Avatar } from 'components/Avatar';
import { InputWithSelect, Option } from 'components/InputWithSelect';
import { Button } from 'components/Button';
import { JoinStakeBanner } from 'components/JoinStakeBanner';
import { currencyCode } from 'utils/currency';
import { debounce } from 'lodash';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { getDigitalCoin } from 'api/get_credit/request';
import { useRouter } from 'next/router';

const requestFiat: TGetDigitalFiat = {
  digitalCurrency: 'BTC',
  digitalAmount: 1,
  fiatCurrency: 'USD',
  target: 'p',
};

const requestLimit: TLimitFiat = {
  type: 'WEB',
  fiat_currency: 'USD',
};

const BuyNow: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [fiat, setFiat] = useState('');
  const [coin, setCoin] = useState('');
  const [invalidFiat, setInvalidFiat] = useState<boolean>(true);
  const [fiatValue, setFiatValue] = useState<number>(0);
  const [digitalFiat, setDigitalFiat] = useState('');
  const [dataLimitFiat, setLimitFiat] = useState<TResponseLimit>();
  const { data: dataFiats, status: statusFiats } = useGetCreditFiats();
  const { data: dataCoins, status: statusCoins } = useGetCreditCoins();
  // TODO: Check API Response

  useEffect(() => {
    // set initial values
    if (dataFiats) setFiat((fiat) => fiat || dataFiats[0]);
    if (dataCoins) setCoin((coin) => coin || dataCoins[0]);
  }, [dataFiats, dataCoins]);

  useEffect(() => {
    // Switch from crypto to money
    mutateDigitalFiat(requestFiat);
    mutateLimitFiat(requestLimit);
  }, []);

  const getFiatIcon = (fiat: string) => {
    let icon = null;
    try {
      const countryCode = currencyCode[fiat].toLowerCase();
      icon = require(`assets/icons/currency/${countryCode}.png`);
    } catch (e) {
      if (e instanceof Error && e) icon = require('assets/icons/currency/vn.png');
    }
    return icon;
  };

  const { mutate: mutateLimitFiat } = useMutation(getLimitFiat, {
    onSuccess: (data) => {
      setLimitFiat(data);
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  // TODO: CHECK API RESPONSE
  const { mutate: mutateDigitalFiat } = useMutation(getFiatCurrency, {
    onSuccess: (data) => {
      setDigitalFiat(data);
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  // TODO: CHECK API RESPONSE
  // Switch from money to crypto
  const { mutate: mutateDigitalCoin } = useMutation(getDigitalCoin, {
    onSuccess: () => {
      message.success('Success!');
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const getDigitalMoney = (fiatValue: number) => {
    const request: TGetDigitalCoin = {
      digitalCurrency: coin,
      fiatCurrency: fiat,
      fiatAmount: fiatValue || 0,
      target: 's',
    };
    if ((dataLimitFiat && fiatValue <= parseInt(dataLimitFiat.minLimit)) || !fiatValue) {
      setFiatValue(fiatValue);
      setInvalidFiat(true);
      message.error(`* Minimum purchase amount for Simplex is ${dataLimitFiat?.minLimit} USD`);
    } else if (dataLimitFiat && fiatValue >= parseInt(dataLimitFiat.maxLimit)) {
      setFiatValue(fiatValue);
      setInvalidFiat(true);
      message.error(`* Maximum purchase amount for Simplex is ${dataLimitFiat?.maxLimit} USD`);
    } else {
      setFiatValue(fiatValue);
      setInvalidFiat(false);
      mutateDigitalCoin(request);
    }
  };

  const debounceFiatValue = debounce((values: any) => {
    getDigitalMoney(values.floatValue);
  }, 1000);

  const onChangeFiat = (value: string) => {
    setFiat(value);
    setFiatValue(0);
    mutateLimitFiat({ ...requestLimit, fiat_currency: value });
    mutateDigitalFiat({ ...requestFiat, fiatCurrency: value });
  };

  const onChangeCoin = (value: string) => {
    setCoin(value);
    mutateDigitalFiat({ ...requestFiat, fiatCurrency: value });
  };

  return (
    <div className={clsx(styles.card, styles.cardBuy)}>
      <div className={styles.cardBuyContent}>
        <h3 className={styles.cardBuyTitle}>{t('homepage.banners.buy_now.title')}</h3>
        <p style={{ lineHeight: 0 }}>
          <span className={styles.cardBuyPriceTextTop}>
            {t('homepage.banners.buy_now.value_text_coin', {
              coin: `1 ${coin}`,
            })}
          </span>
          <br />
          <span className={styles.cardBuyPriceTextBottom}>
            {digitalFiat ? 'data' : '~1.002 '} {fiat}
          </span>
        </p>
        <p className={styles.paymentPrompt}>{t('homepage.banners.buy_now.payment_prompt')}</p>
      </div>
      <div className={styles.cardBuyInputs}>
        <Space direction="vertical" size={20}>
          <InputWithSelect
            selectProps={{
              value: fiat,
              onChange: (value) => onChangeFiat(value),
              loading: statusFiats === 'loading',
            }}
            inputProps={{
              placeholder: '0',
              onValueChange: (values: any) => debounceFiatValue(values),
            }}
            invalid={invalidFiat && fiatValue !== 0}
          >
            {dataFiats?.map((fiat) => {
              return (
                <Option key={fiat} value={fiat}>
                  <Space size={4} align="center">
                    <Avatar type="secondary" src={getFiatIcon(fiat).default} size={22} />
                    <span>{fiat}</span>
                  </Space>
                </Option>
              );
            })}
          </InputWithSelect>
          <InputWithSelect
            selectProps={{
              value: coin,
              onChange: (value) => onChangeCoin(value),
              loading: statusCoins === 'loading',
            }}
            inputProps={{
              defaultValue: 12673101,
              disabled: true,
            }}
          >
            {dataCoins?.map((coin) => {
              return (
                <Option key={coin} value={coin}>
                  <Space size={3} align="center">
                    <Avatar type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} size={22} />
                    <span>{coin}</span>
                  </Space>
                </Option>
              );
            })}
          </InputWithSelect>
          <p className={styles.paymentPromptMobile}>{t('homepage.banners.buy_now.payment_prompt')}</p>
          <div className={styles.arrowDown}>
            <div className={styles.border} />
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </Space>
      </div>
      <Button
        type="turqoise"
        className={clsx(styles.btn, styles.btnBuyAndGo)}
        disabled={invalidFiat || fiatValue === 0}
        onClick={() => router.push('/simplex')}
      >
        Buy & Go
      </Button>
    </div>
  );
};

export const ActionBanners: FC = () => {
  return (
    <section className="container">
      <Row gutter={[24, 56]} className={commonStyles.root}>
        <Col md={24} lg={12}>
          <BuyNow />
        </Col>
        <Col md={24} lg={12}>
          <JoinStakeBanner />
        </Col>
      </Row>
    </section>
  );
};
