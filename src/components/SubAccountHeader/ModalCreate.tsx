import { FC, useEffect, useState } from 'react';
import { Col, Modal, Row, Form, message } from 'antd';
import { InputWithLabel } from 'components/Input';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setIsLoadingSub, setListSubAccount, setModalCreate } from 'store/ducks/sub_account/slice';
import { useMutation } from 'react-query';
import { createSubAccount, getSubAccounts } from 'api/sub_account';
import { TError } from 'api/types';
import { useTranslation } from 'react-i18next';

export interface ModalCreateProps {
  className?: string;
}

export const ModalCreate: FC<ModalCreateProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { visibleModalCreate } = useAppSelector((state) => state.subAccount);
  const [form] = Form.useForm();
  const [name, setName] = useState('');

  const onCreateSubAccount = (e: any) => {
    mutateCreateSubAccount(e);
  };

  const { mutate: subAccounts, status: sttSubAccounts } = useMutation(getSubAccounts, {
    onSuccess: (data) => {
      const filterSubAccount = data.filter((item: any) => !!item.parentAccountId);
      dispatch(setListSubAccount(filterSubAccount));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateCreateSubAccount, status: sttCreateSubAccount } = useMutation(createSubAccount, {
    onSuccess: () => {
      subAccounts();
      message.success(t('sub_account.create.success'));
      form.resetFields();
      dispatch(setModalCreate(false));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    dispatch(setIsLoadingSub(sttSubAccounts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sttSubAccounts]);

  const onChangeInput = (e: any) => {
    setName(e.target.value.replace(/\s/g, ''));
  };

  return (
    <Modal
      centered
      title={t('sub_account.create.title')}
      visible={visibleModalCreate}
      onOk={form.submit}
      onCancel={() => dispatch(setModalCreate(false))}
      okText={t('sub_account.create.button')}
      maskClosable
      confirmLoading={sttCreateSubAccount === 'loading'}
    >
      <Form name="create_sub_account" onFinish={onCreateSubAccount} form={form}>
        <Form.Item name="subAccountName" label={t('sub_account.placeholder_name_error')} rules={[{ required: true }]}>
          <Row>
            <Col lg={24}>
              <InputWithLabel
                id="name"
                label={t('sub_account.create.placeholder_name')}
                onChange={onChangeInput}
                value={name}
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};
