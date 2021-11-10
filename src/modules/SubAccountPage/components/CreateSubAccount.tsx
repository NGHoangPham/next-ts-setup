import { FC } from 'react';
import { Col, Row } from 'antd';
import clsx from 'clsx';

import { Surface } from 'components/Surface';
import styles from './CreateSubAccount.module.css';
import { Button } from 'components/Button';
import { useAppDispatch } from 'hooks';
import { setModalCreate } from 'store/ducks/sub_account/slice';
import { useTranslation } from 'next-i18next';

const CreateSubAccount: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <Surface borderMd={true} className={clsx(styles.root, 'container')}>
      <Row gutter={[24, 24]}>
        <Col span={24} className={styles.createSubAccount}>
          <p>{t('sub_account.create.description')}</p>

          <Button onClick={() => dispatch(setModalCreate(true))}>{t('sub_account.create.button')}</Button>
        </Col>
      </Row>
    </Surface>
  );
};

export default CreateSubAccount;
