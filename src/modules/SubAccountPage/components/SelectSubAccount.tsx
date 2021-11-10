import { FC, useEffect, useState } from 'react';
import { Col, message, Radio, Row, Space, Form, Spin } from 'antd';
import clsx from 'clsx';
import { faPen, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Surface } from 'components/Surface';
import styles from './CreateSubAccount.module.css';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setCurrentSubAccount, setListSubAccount, setModalDelete } from 'store/ducks/sub_account/slice';
import { ModalDelete } from 'components/SubAccountHeader/ModalDelete';
import { useMutation } from 'react-query';
import { changeNameSubAcc, getSubAccounts } from 'api/sub_account';
import { TError } from 'api/types';
import { useTranslation } from 'react-i18next';

const SelectSubAccount: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentSubAccount, listSubAccount, isLoadingSub } = useAppSelector((state) => state.subAccount);
  const [isEdit, setEdit] = useState('');
  const [form] = Form.useForm();
  useEffect(() => {
    if (currentSubAccount !== 'Main Account') setEdit('');
  }, [currentSubAccount]);

  const onChange = (e: any) => {
    dispatch(setCurrentSubAccount(e.target.value));
  };

  const { mutate: mutateChangeName, status: sttChangeName } = useMutation(changeNameSubAcc, {
    onSuccess: () => {
      subAccounts();
      setEdit('');
      message.success(t('sub_account.update.update_success'));
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { mutate: subAccounts } = useMutation(getSubAccounts, {
    onSuccess: (data) => {
      const filterSubAccount: any = data;
      const tempData = filterSubAccount.filter((item: any) => !!item.parentAccountId);
      dispatch(setListSubAccount(tempData));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const onChangeNameSub = (e: any, accountId: string) => {
    mutateChangeName({ ...e, subAccountId: accountId });
  };

  const onChangeEdit = (accountId: any, accountName: any) => {
    setEdit(accountId);
    form.setFieldsValue({ subAccountName: accountName });
  };

  const onChangeInput = (e: any) => {
    form.setFieldsValue({ subAccountName: e.target.value.replace(/\s/g, '') });
  };

  return (
    <>
      <Surface borderMd={true} className={clsx(styles.root, 'container')}>
        <Row gutter={[24, 0]}>
          <Col span={24} className={styles.title}>
            <h3>{t('sub_account.title_select_sub')}</h3>
            <p className={styles.subtitle}>{t('sub_account.subtitle_select_sub')}</p>
          </Col>
          <Col span={24} className={styles.selectSubAcc}>
            <Radio.Group onChange={onChange} value={currentSubAccount} className={styles.subAccountWrapper}>
              <Space direction="vertical" className={styles.vertical}>
                <Radio value={t('sub_account.main_account')} className={styles.subAccountItem}>
                  {t('sub_account.main_account')}
                </Radio>
                {isLoadingSub === 'loading' || sttChangeName === 'loading' ? (
                  <Spin />
                ) : (
                  listSubAccount?.map((entry) => (
                    <Row className={styles.subAccountItem} justify="space-between" key={entry.accountId}>
                      <Col span={12}>
                        <Radio value={entry.accountId}>
                          {isEdit === entry.accountId ? (
                            <Form
                              name="update_sub_account"
                              onFinish={(subAccountName) => onChangeNameSub(subAccountName, entry.accountId)}
                              form={form}
                            >
                              <Form.Item
                                name="subAccountName"
                                label={t('sub_account.placeholder_name')}
                                rules={[{ required: true }]}
                              >
                                <Input onChange={onChangeInput} />
                              </Form.Item>
                            </Form>
                          ) : (
                            `${entry.nickName}`
                          )}
                        </Radio>
                        {currentSubAccount === entry.accountId ? (
                          <></>
                        ) : isEdit === entry.accountId ? (
                          <>
                            <Button className={styles.btnAction} onClick={form.submit}>
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            <Button className={styles.btnAction} onClick={() => setEdit('')}>
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </>
                        ) : (
                          <Button
                            className={styles.btnAction}
                            onClick={() => onChangeEdit(entry.accountId, entry.nickName)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </Button>
                        )}
                      </Col>
                      {currentSubAccount === entry.accountId ? (
                        <></>
                      ) : (
                        <Col span={1}>
                          <Space>
                            <Button className={styles.btnAction} onClick={() => dispatch(setModalDelete(entry))}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Space>
                        </Col>
                      )}
                    </Row>
                  ))
                )}
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Surface>
      <ModalDelete />
    </>
  );
};

export default SelectSubAccount;
