import { FC, useEffect } from 'react';
import { Col, message, Row, Tabs } from 'antd';
import { faPlus, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from 'components/Button';
import { Surface } from 'components/Surface';
import styles from './styles.module.css';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  setCurrentSubAccount,
  setIsLoadingSub,
  setListSubAccount,
  setMainAccountId,
  setModalCreate,
  setModalTransfer,
} from 'store/ducks/sub_account/slice';
import { ModalCreate } from './ModalCreate';
import { ModalTransfer } from './ModalTransfer';
import { getSubAccounts } from 'api/sub_account';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';

export interface SubAccountProps {
  className?: string;
}

const { TabPane } = Tabs;

export const SubAccountHeader: FC<SubAccountProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listSubAccount, currentSubAccount } = useAppSelector((state) => state.subAccount);

  const onChangeSubAcc = (e: any) => {
    dispatch(setCurrentSubAccount(e));
  };

  useEffect(() => {
    subAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: subAccounts, status: sttSubAccounts } = useMutation(getSubAccounts, {
    onSuccess: (data) => {
      let filterSubAccount = data.filter((item: any) => !!item.parentAccountId);
      dispatch(setMainAccountId(data[0].accountId));
      dispatch(setListSubAccount(filterSubAccount));
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
    <>
      <Surface borderMd={true} className={styles.root}>
        <Row align="middle" gutter={[24, 0]} wrap={false}>
          <Col className={styles.titleSub}>{t('sub_account.sub_account_header')}</Col>
          <Col className={styles.tabWrapper}>
            <Tabs
              activeKey={currentSubAccount}
              className={styles.subAccWrapper}
              onChange={onChangeSubAcc}
              defaultActiveKey="Main Account"
            >
              <TabPane tab={t('sub_account.main_account')} key={'Main Account'} />
              {listSubAccount?.map((entry) => (
                <TabPane tab={entry.nickName} key={entry.accountId} />
              ))}
            </Tabs>
          </Col>
          <Col lg={4}>
            <Button size="middle" className={styles.btnAction} onClick={() => dispatch(setModalCreate(true))}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            {listSubAccount.length ? (
              <Button size="middle" className={styles.btnAction} onClick={() => dispatch(setModalTransfer(true))}>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </Button>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </Surface>
      <ModalCreate />
      <ModalTransfer />
    </>
  );
};
