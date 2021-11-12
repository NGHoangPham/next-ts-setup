import { FC, useEffect, useState } from 'react';
import { Col, Row, Form, Space, message, Spin } from 'antd';
import styles from './TransferSubAccount.module.css';
import clsx from 'clsx';

import { SelectWithLabel, Option } from 'components/Select';
import { Surface } from 'components/Surface';
import { Button } from 'components/Button';
import { Avatar } from 'components/Avatar';
import { currencyImgs } from 'assets/images/currency';
import { useAppSelector } from 'hooks';
import { InputNumber } from 'components/Input';
import { useMutation } from 'react-query';
import { getCoinsWithSubAccount, TListSubAccount, transferBetweenSub } from 'api/sub_account';
import { getWalletQuery } from 'api/wallet/request';
import { useTranslation } from 'next-i18next';
import { TError } from 'api/types';

export interface TransferSubAccountProps {
  className?: string;
}

export const TransferSubAccount: FC<TransferSubAccountProps> = () => {
  const { t } = useTranslation();
  const { currentSubAccount, listSubAccount, mainAccountId } = useAppSelector((state) => state.subAccount);
  const [dataWallet, setDataWallet] = useState<any>([]);
  const [coin, setCoin] = useState<string>('');
  const [dataCoin, setDataCoin] = useState<any>([]);
  const [targetAccount, setTarget] = useState('');
  const [sourceAccount, setSource] = useState('');
  const [listSource, setListSource] = useState<TListSubAccount[]>(listSubAccount);
  const [listTarget, setListTarget] = useState<TListSubAccount[]>(listSubAccount);
  const [form] = Form.useForm();

  const onTransfer = (e: any) => {
    const requestTransfer = { ...e, amount: e.amount.toString() };
    mutateTransferSub(requestTransfer);
  };

  const { mutate: mutateTransferSub, status: sttTransferSub } = useMutation(transferBetweenSub, {
    onSuccess: () => {
      message.success(t('sub_account.transfer.success'));
      mutateWallet();
      form.resetFields();
      setListSource(listSubAccount);
      setListTarget(listSubAccount);
      setTarget('');
      setSource('');
      setCoin('');
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateCoinSub, status: sttCoinSub } = useMutation(getCoinsWithSubAccount, {
    onSuccess: (data) => {
      setDataWallet(data.coins);
      const dataCoin = data?.coins?.filter((item: any) => item.coinType === coin);
      setDataCoin(dataCoin);
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const setSourceAccount = (value: any) => {
    setSource(value);
    const requestCoinSub = {
      accountId: value,
    };
    mutateCoinSub(requestCoinSub);
    form.resetFields(['amount']);
  };

  useEffect(() => {
    mutateWallet();
    setCoin('');
    form.resetFields();
  }, [currentSubAccount]);

  useEffect(() => {
    setListSource(listSubAccount);
    setListTarget(listSubAccount);
  }, [listSubAccount]);

  useEffect(() => {
    if (sourceAccount) {
      let tempTarget = listSubAccount.filter((item) => item.accountId !== sourceAccount);
      setListTarget(tempTarget);
    }
    if (targetAccount) {
      let tempSource = listSubAccount.filter((item) => item.accountId !== targetAccount);
      setListSource(tempSource);
    }
  }, [sourceAccount, targetAccount, listSubAccount]);

  const { mutate: mutateWallet, status: statusWallet } = useMutation(getWalletQuery, {
    onSuccess: (data) => {
      setDataWallet(data.coins);
      const dataCoin = data?.coins?.filter((item: any) => item.coinType === coin);
      setDataCoin(dataCoin);
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const onChangeCoin = (value: any) => {
    setCoin(value);
    const dataCoin = dataWallet?.filter((item: any) => item.coinType === value);
    setDataCoin(dataCoin);
    form.resetFields(['amount']);
  };

  const checkAmount = (_: any, value: number) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Amount must be greater than zero!'));
  };

  const setTargetAccount = (value: any) => {
    setTarget(value);
    form.resetFields(['amount']);
  };

  return (
    <Surface borderMd={true} className={clsx(styles.root, 'container')}>
      <Col span={24} className={styles.title}>
        <h3>{t('sub_account.transfer.title')}</h3>
      </Col>
      <Form name="transfer_sub_account" onFinish={onTransfer} form={form}>
        <Row gutter={[24, 24]}>
          <Col md={24} lg={10} sm={24}>
            <Form.Item name="coin" label={t('sub_account.transfer.placeholder_coin')} rules={[{ required: true }]}>
              <SelectWithLabel
                label={t('sub_account.transfer.placeholder_coin')}
                value={coin}
                onChange={(value) => onChangeCoin(value)}
                loading={statusWallet === 'loading'}
              >
                {dataWallet?.map((coin: any, index: any) => (
                  <Option key={index} value={coin.coinType}>
                    <Space size={3} align="center">
                      <Avatar type="secondary" src={currencyImgs[coin.coinType] || currencyImgs.GENERIC} size={22} />
                      <span>{coin.coinType}</span>
                    </Space>
                  </Option>
                ))}
              </SelectWithLabel>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col md={24} lg={10} sm={24}>
            <Form.Item
              name="sourceAccount"
              label={t('sub_account.transfer.placeholder_source')}
              rules={[{ required: true }]}
            >
              <SelectWithLabel
                label={t('sub_account.transfer.placeholder_source')}
                value={sourceAccount}
                onChange={(value) => setSourceAccount(value)}
              >
                {targetAccount !== mainAccountId ? (
                  <Option key={'Main Account'} value={mainAccountId}>
                    {t('sub_account.main_account')}
                  </Option>
                ) : (
                  <></>
                )}
                {listSource &&
                  listSource?.map((entry) => (
                    <Option key={entry.accountId} value={entry.accountId}>
                      {entry.nickName}
                    </Option>
                  ))}
              </SelectWithLabel>
            </Form.Item>
          </Col>
          <Col md={24} lg={10} sm={24}>
            <Form.Item
              name="targetAccount"
              label={t('sub_account.transfer.placeholder_target')}
              rules={[{ required: true }]}
            >
              <SelectWithLabel
                label={t('sub_account.transfer.placeholder_target')}
                value={targetAccount}
                onChange={(value) => setTargetAccount(value)}
              >
                {sourceAccount !== mainAccountId ? (
                  <Option key={'Main Account'} value={mainAccountId}>
                    {t('sub_account.main_account')}
                  </Option>
                ) : (
                  <></>
                )}
                {listTarget?.map((entry) => (
                  <Option key={entry.accountId} value={entry.accountId}>
                    {entry.nickName}
                  </Option>
                ))}
              </SelectWithLabel>
            </Form.Item>
          </Col>
        </Row>
        <>
          {coin && (
            <>
              <Row gutter={[12, 0]} align="top">
                <Col>
                  <p className={styles.amountTitle}>{t('sub_account.transfer.amount')}</p>
                </Col>
                <Col lg={5} md={6} sm={8} className={styles.amountWrapper}>
                  <Form.Item
                    name="amount"
                    label={t('sub_account.transfer.amount')}
                    className={styles.amount}
                    rules={[{ required: true, validator: checkAmount }]}
                  >
                    <InputNumber min={0} max={dataCoin[0]?.assessment} defaultValue={0} />
                  </Form.Item>
                </Col>
                <Col lg={3} className={styles.amountWrapper}>
                  <Button
                    className={styles.btnMax}
                    type="primary"
                    onClick={() =>
                      form.setFieldsValue({
                        amount: parseFloat(dataCoin[0]?.assessment),
                      })
                    }
                  >
                    {t('sub_account.transfer.max')}
                  </Button>
                </Col>
                {/* <Col lg={15} /> */}
              </Row>
              <Row className={styles.titleMax}>
                <Col>
                  {t('sub_account.transfer.max')}
                  {sttCoinSub === 'loading' || statusWallet === 'loading' ? (
                    <Spin className={styles.spin} />
                  ) : (
                    `: ${dataCoin[0]?.assessment} ${coin}`
                  )}
                </Col>
              </Row>
            </>
          )}
        </>
        <Row gutter={[24, 0]}>
          <Col lg={{ span: 3 }}>
            <Button htmlType="submit" className={styles.btnSubmit} loading={sttTransferSub === 'loading'}>
              {t('sub_account.transfer.button')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Surface>
  );
};
