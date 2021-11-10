import { FC } from 'react';
import { Form, message, Switch } from 'antd';
import styles from './AccountPreference.module.css';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/Button';
import { SelectWithLabel, Option } from 'components/Select/SelectWithLabel';
import { Surface } from 'components/Surface';
import { useCurrencyGroupItem } from 'api/account';
import { useEffect, useState } from 'react';
import { CurrencyGroupItemResponse } from 'api/account/types';
import { USER_COOKIES, DEFAULT_CURRENCY } from 'utils/constant';
import { InputWithLabel } from 'components/Input';
import { coinSymbol } from 'modules/AccountManagementPage/constant';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setCurrentCurrency } from 'store/ducks/account/slice';
import { getCookies } from 'utils/cookies';

const selectedCurrency = ['USD', 'JPY', 'CNY', 'EUR', 'GBP', 'KRW', 'TWD', 'TRY'];
interface setCurrency {
  localCurrency: string;
}

interface SwitcherProps {
  title: string;
  name: string;
  value: boolean;
  handleChangeSetting: Function;
  disabled: boolean;
}

const Switcher = ({ title, value, handleChangeSetting, disabled }: SwitcherProps) => {
  return (
    <div className={styles.switcher}>
      <div className={styles.title}>{title}</div>
      <div className={clsx(styles.switcherBtn, 'switchBtn')}>
        <Switch disabled={disabled} checked={value} onChange={(value) => handleChangeSetting(value)} />
      </div>
    </div>
  );
};

const AccountPreference: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentCurrency } = useAppSelector((state) => state.account);
  const [localCurrency, setLocalCurrency] = useState(JSON.parse(currentCurrency!).coinType);

  const [btnEdit, setBtnEdit] = useState(false);
  let d = new Date();
  let timeZoneOffset: any = d.getTimezoneOffset();
  let f = '';
  if (timeZoneOffset <= 0) {
    f = '+';
  }
  let ss: any = -timeZoneOffset % 60;
  if (ss === 0) {
    ss += '0';
  }
  let time = -(timeZoneOffset / 60) + ':' + ss;
  let utc_time = '(UTC' + f + time + ')';
  let country = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/');
  const { data } = useCurrencyGroupItem();

  const [switchToken, setSwitchToken] = useState(true);
  const [currency, setCurrency] = useState(Array);

  useEffect(() => {
    if (!data) return;
    const tempCurrency = data.filter((el) => selectedCurrency.includes(el?.coinType));
    tempCurrency?.forEach((entry: CurrencyGroupItemResponse) => {
      entry.symbol = coinSymbol[entry?.coinType].type;
    });
    setCurrency(tempCurrency);

    if (!getCookies(USER_COOKIES.currentCurrency)) {
      const temp = JSON.stringify(tempCurrency?.find((el) => el.coinType === DEFAULT_CURRENCY));
      dispatch(setCurrentCurrency(temp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setLocalCurrency(JSON.parse(currentCurrency!).coinType);
  }, [currentCurrency]);

  const onSave = (values: setCurrency) => {
    const temp = JSON.stringify(currency.find((element: any) => element.coinType === values.localCurrency));
    dispatch(setCurrentCurrency(temp));
    setBtnEdit(false);
    message.success(t('account_management.preference.update_success'));
  };

  const onSaveFailed = () => {
    message.error('System error!');
  };

  const onChangeCurrency = (value: string) => {
    setLocalCurrency(value);
  };

  const handleChangeSetting = (value: boolean) => {
    setSwitchToken(value);
  };

  return (
    <>
      <Form onFinish={onSave} onFinishFailed={onSaveFailed} initialValues={{ localCurrency: localCurrency }}>
        <Surface borderMd className={styles.root}>
          <h4 className={styles.text}>{t('account_management.preference.title')}</h4>
          <div className={styles.form}>
            <Form.Item name="localCurrency" rules={[{ required: true, message: 'Local Currency is required' }]}>
              {currency && currency.length > 0 && currentCurrency && (
                <SelectWithLabel
                  disabled={!btnEdit}
                  value={localCurrency}
                  id="localCurrency"
                  label="Local Currency"
                  onChange={onChangeCurrency}
                >
                  {currency.map((entry: any, index) => {
                    return (
                      <Option key={index} value={entry.coinType}>
                        {t(`account_management.setting_currency_${entry.coinType}`)}
                      </Option>
                    );
                  })}
                </SelectWithLabel>
              )}
            </Form.Item>
            <Form.Item
              // name="timeZone"
              rules={[{ required: true, message: 'Local Currency is required' }]}
            >
              <InputWithLabel
                disabled={true}
                id="timeZone"
                label="TIME ZONE"
                defaultValue={country[1] + ' ' + utc_time}
              />
            </Form.Item>
            <Form.Item
              // name="isTokenReport"
              label="Switch"
              valuePropName="checked"
            >
              <Switcher
                title="RIGHTS Token Daily Report"
                value={switchToken}
                handleChangeSetting={handleChangeSetting}
                name="isToken"
                disabled={!btnEdit}
              />
            </Form.Item>
          </div>
          {btnEdit && (
            <Button htmlType="submit" className={styles.btnSubmit} type="secondary">
              {t('account_management.save_btn')}
            </Button>
          )}
        </Surface>
      </Form>
      {!btnEdit && (
        <Button className={styles.btnEdit} type="primary" onClick={() => setBtnEdit(true)}>
          {t('account_management.edit_btn')}
        </Button>
      )}
    </>
  );
};

export default AccountPreference;
