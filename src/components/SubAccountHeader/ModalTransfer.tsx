import { FC, useEffect, useState } from 'react';
import { Col, Row, Form, Space, message, Modal, Spin } from 'antd';
import styles from './styles.module.css';
import { useAppDispatch, useAppSelector } from 'hooks';

import { setModalTransfer } from 'store/ducks/sub_account/slice';
import { SelectWithLabel, Option } from 'components/Select';
import { Button } from 'components/Button';
import { Avatar } from 'components/Avatar';
import { currencyImgs } from 'assets/images/currency';
import { InputNumber } from 'components/Input';
import { useMutation } from 'react-query';
import { transferBetweenSub, getCoinsWithSubAccount, TListSubAccount } from 'api/sub_account';
import { useTranslation } from 'next-i18next';
import { UseQueryResult } from 'react-query';
import { WalletGroupItem } from 'api/wallet/types';
import { useWalletQuery } from 'api/wallet';

export interface ModelTransferProps {
  className?: string;
}

export const ModalTransfer: FC<ModelTransferProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentSubAccount, listSubAccount, mainAccountId, visibleModalTransfer } = useAppSelector(
    (state) => state.subAccount
  );
  const [dataWallet, setDataWallet] = useState<any>([]);
  const [coin, setCoin] = useState<string>('');
  const [dataCoin, setDataCoin] = useState<any>([]);
  const [sourceAccount, setSource] = useState('');
  const [targetAccount, setTarget] = useState('');
  const [listSource, setListSource] = useState<TListSubAccount[]>(listSubAccount);
  const [listTarget, setListTarget] = useState<TListSubAccount[]>(listSubAccount);
  const [form] = Form.useForm();
  const {
    data: walletData,
    status: statusWallet,
    refetch: refetchWalletData,
  }: UseQueryResult<WalletGroupItem> = useWalletQuery({
    refetchInterval: 10000,
  });

  const onTransfer = (e: any) => {
    const requestTransfer = { ...e, amount: e.amount.toString() };
    mutateTransferSub(requestTransfer);
  };

  const { mutate: mutateTransferSub, status: sttTransferSub } = useMutation(transferBetweenSub, {
    onSuccess: () => {
      message.success(t('sub_account.transfer.success'));
      refetchWalletData();
      dispatch(setModalTransfer(false));
      form.resetFields();
      setListSource(listSubAccount);
      setListTarget(listSubAccount);
      setTarget('');
      setSource('');
      setCoin('');
    },
    onError: (error: any) => {
      message.error(error);
    },
  });

  const { mutate: mutateCoinSub, status: sttCoinSub } = useMutation(getCoinsWithSubAccount, {
    onSuccess: (data) => {
      setDataWallet(data.coins);
      const dataCoin = data?.coins?.filter((item: any) => item.coinType === coin);
      setDataCoin(dataCoin);
    },
    onError: (error: any) => {
      message.error(error);
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

  const setTargetAccount = (value: any) => {
    setTarget(value);
    form.resetFields(['amount']);
  };

  useEffect(() => {
    refetchWalletData();
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

  useEffect(() => {
    if (walletData) {
      setDataWallet(walletData.coins);
    }
    const dataCoin = walletData?.coins?.filter((item: any) => item.coinType === coin);
    setDataCoin(dataCoin);
  }, [walletData]);

  const onChangeCoin = (value: any) => {
    setCoin(value);
    const dataCoin = dataWallet?.filter((item: any) => item.coinType === value);
    setDataCoin(dataCoin);
    form.resetFields(['amount']);
  };

  const onCancelModal = () => {
    setCoin('');
    form.resetFields();
    dispatch(setModalTransfer(false));
  };

  const checkAmount = (_: any, value: number) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Amount must be greater than zero!'));
  };

  return (
    <Modal
      centered
      title={t('sub_account.transfer.title')}
      visible={visibleModalTransfer}
      onOk={form.submit}
      onCancel={() => onCancelModal()}
      okText={t('sub_account.transfer.button')}
      maskClosable
      width="fit-content"
      confirmLoading={sttTransferSub === 'loading'}
    >
      <Form name="transfer_subaccount" onFinish={onTransfer} form={form} className={styles.transfer}>
        <Row gutter={[24, 24]}>
          <Col lg={{ span: 24 }}>
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
          <Col md={24} lg={24}>
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
          <Col md={24} lg={24}>
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
        {coin && (
          <>
            <Row gutter={[12, 0]} align="top">
              <Col>
                <p className={styles.amountTitle}>{t('sub_account.transfer.amount')}</p>
              </Col>
              <Col lg={10} md={12} sm={14} className={styles.amountWrapper}>
                <Form.Item
                  name="amount"
                  label={t('sub_account.transfer.amount')}
                  className={styles.amount}
                  rules={[{ required: true, validator: checkAmount }]}
                >
                  <InputNumber min={0} max={dataCoin[0]?.assessment} defaultValue={0} />
                </Form.Item>
              </Col>
              <Col span={3} className={styles.amountWrapper}>
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
      </Form>
    </Modal>
  );
};
