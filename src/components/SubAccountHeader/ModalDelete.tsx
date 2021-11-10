import { FC, useEffect } from 'react';
import { Col, Modal, Row, message } from 'antd';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setIsLoadingSub, setListSubAccount, setModalDelete } from 'store/ducks/sub_account/slice';
import { useMutation } from 'react-query';
import { deleteSubAccount, getSubAccounts } from 'api/sub_account';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';

export interface ModalDeleteProps {
  className?: string;
}

export const ModalDelete: FC<ModalDeleteProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { visibleModalDelete } = useAppSelector((state) => state.subAccount);
  const onDeleteSubAcc = (e: any) => {
    let requestDelete = {
      deleteAccountId: e,
    };
    mutateDeleteSubAccount(requestDelete);
    dispatch(setModalDelete({}));
  };

  const { mutate: mutateDeleteSubAccount, status: sttDeleteSubAccount } = useMutation(deleteSubAccount, {
    onSuccess: () => {
      dispatch(setModalDelete({}));
      subAccounts();
      message.success(t('sub_account.delete.success'));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: subAccounts, status: sttSubAccounts } = useMutation(getSubAccounts, {
    onSuccess: (data) => {
      const filterSubAccount: any = data;
      const tempData = filterSubAccount.filter((item: any) => !!item.parentAccountId);

      dispatch(setListSubAccount(tempData));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    dispatch(setIsLoadingSub(sttSubAccounts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sttSubAccounts]);

  return (
    <Modal
      centered
      title={`${t('sub_account.delete.title')} ${visibleModalDelete?.nickName}`}
      visible={!!visibleModalDelete?.accountId}
      onOk={() => onDeleteSubAcc(visibleModalDelete?.accountId)}
      onCancel={() => dispatch(setModalDelete({}))}
      okText={t('sub_account.delete.button_yes')}
      maskClosable
      confirmLoading={sttDeleteSubAccount === 'loading'}
    >
      <Row>
        <Col lg={24}>{t('sub_account.delete.description')}</Col>
      </Row>
    </Modal>
  );
};
