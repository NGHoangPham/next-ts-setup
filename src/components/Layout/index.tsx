import { FC, useMemo } from 'react';
import styles from './Layout.module.css';
import { Layout as AntdLayout } from 'antd';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import { TFunction, useTranslation } from 'next-i18next';
import { useAppSelector } from 'hooks';
import clsx from 'clsx';

const getValidateMessages = (t: TFunction) => ({
  required: `* \${label} ${t('form.validate.required')}`,
  whitespace: '${name} cannot be empty 123',
});

export const Layout: FC = ({ children }) => {
  const { t } = useTranslation();

  const { fullscreen } = useAppSelector((state) => state.system.exchange);

  const validateMessages = useMemo(() => getValidateMessages(t), [t]);

  return (
    <AntdConfigProvider
      form={{
        validateMessages,
      }}
    >
      <AntdLayout className={clsx(styles.root, fullscreen ? styles.minHeight : undefined)}>
        <NavBar />
        <div className={styles.bg}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
        </div>
        <main className={fullscreen ? styles.fullscreen : undefined}>{children}</main>
        <Footer />
      </AntdLayout>
    </AntdConfigProvider>
  );
};
