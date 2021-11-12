import { FC, useState } from 'react';
import styles from './NavBar.module.css';
import { Layout, Menu, Space, Grid } from 'antd';
import { Button as ButtonAntd } from 'antd';
import clsx from 'clsx';
import { TFunction, useTranslation } from 'react-i18next';
import {
  faChevronDown,
  faUser,
  faArrowRight,
  faCoins,
  faPowerOff,
  faThLarge,
  faAlignJustify,
  faUsers,
  faHistory,
  faGift,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'components/Button';
import { Dropdown } from 'components/Dropdown';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useMemo } from 'react';
import { LanguageSelect } from 'components/LanguageSelect';
import Link from 'next/link';

import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined';
import { PopupTradeSetting } from './PopupTradeSetting';
import { QuickOrder } from './QuickOrder';
import { routes } from 'types/routes';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { NextRouter, useRouter } from 'next/router';

const { useBreakpoint } = Grid;
const { SubMenu } = Menu;

const navigationRoutes = [
  { title: 'navbar.menu.buy_crypto', path: routes.buy },
  { title: 'navbar.menu.trade', path: routes.exchange },
  { title: 'navbar.menu.market', path: routes.market },
  { title: 'navbar.menu.staking', path: routes.staking },
];

const walletRoutes = [
  { title: 'navbar.wallet.overview', path: routes.wallet },
  { title: 'navbar.wallet.spot_wallet', path: routes.spotWallet },
];

const accountRoutes = [
  {
    title: 'navbar.account.account_management',
    path: routes.accountManagement,
    icon: faThLarge,
  },
  {
    title: 'navbar.account.reward_center',
    path: routes.rewardCenter,
    icon: faGift,
  },
  {
    icon: faUsers,
    title: 'navbar.account.referral_dashboard',
    path: routes.referral,
  },
  {
    icon: faCoins,
    title: 'navbar.account.earnings',
    path: routes.earnings,
  },
  {
    icon: faHistory,
    title: 'navbar.account.history',
    path: routes.history,
  },
  {
    icon: faWallet,
    title: 'subaccounts',
    path: routes.subAccount,
  },
];

const getWalletMenu = (t: TFunction<'translation'>) => (
  <Menu>
    {walletRoutes.map((wallet) => (
      <Link key={wallet.title} href={wallet.path}>
        <a>
          <Menu.Item>{t(wallet.title)}</Menu.Item>
        </a>
      </Link>
    ))}
  </Menu>
);

const handleLogout = () => {
  window.location.href = '/api/auth/logout';
};

const getAccountMenu = (t: TFunction<'translation'>, router: NextRouter, dispatch: Function, user?: UserProfile) => (
  <Menu>
    <Menu.Item
      key={user?.email}
      icon={<FontAwesomeIcon icon={faArrowRight} />}
      onClick={() => router.push(routes.accountManagement)}
    >
      {user?.email}
    </Menu.Item>
    <Menu.Divider />
    {accountRoutes.map((account) => (
      <Menu.Item
        key={account.title}
        icon={<FontAwesomeIcon icon={account.icon} />}
        onClick={() => router.push(account.path)}
      >
        {t(account.title)}
      </Menu.Item>
    ))}
    <Menu.Item key="navbar.account.log_out" icon={<FontAwesomeIcon icon={faPowerOff} />} onClick={handleLogout}>
      {t('navbar.account.log_out')}
    </Menu.Item>
  </Menu>
);

export const NavBar: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const { exchange } = useAppSelector((state) => state.system);
  const { user } = useUser();

  const walletMenu = useMemo(() => getWalletMenu(t), [t]);
  const accountMenu = useMemo(() => getAccountMenu(t, router, dispatch, user), [t, router, dispatch, user]);
  const screens = useBreakpoint();
  const currentPage = router?.pathname;
  return (
    <Layout.Header className={styles.root}>
      <div className={clsx('container', styles.content)}>
        <Link href={routes.home}>
          <a>
            <img src="/images/logo.svg" alt="logo" className={styles.logo} />
          </a>
        </Link>
        {screens.lg ? (
          <Menu mode="horizontal" className={styles.menu}>
            {navigationRoutes.map((route) => (
              <Menu.Item key={route.path} onClick={() => router.push(route.path)}>
                {t(route.title)}
              </Menu.Item>
            ))}
          </Menu>
        ) : (
          <Menu mode="horizontal" className={styles.menu}>
            <SubMenu key="subMenu" icon={<FontAwesomeIcon icon={faAlignJustify} />}>
              {navigationRoutes.map((route) => (
                <Menu.Item key={route.path} onClick={() => router.push(route.path)}>
                  {t(route.title)}
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        )}
        {exchange.quickOrder && currentPage === '/exchange' && <QuickOrder />}
        <div className={styles.rightMenu}>
          <Space align="center" className={styles.buttons}>
            {user ? (
              <>
                <Dropdown overlay={walletMenu}>
                  <p className="mb-0 cursor">
                    {t('navbar.wallet.title')}
                    <FontAwesomeIcon className={styles.downOutline} icon={faChevronDown} />
                  </p>
                </Dropdown>
                <Dropdown overlayClassName={styles.accountDropdown} overlay={accountMenu}>
                  <div className={styles.accountButton}>
                    <ButtonAntd shape="circle" icon={<FontAwesomeIcon icon={faUser} color="#fff" />} size="middle" />
                  </div>
                </Dropdown>
              </>
            ) : (
              <>
                <a href="/api/auth/login">
                  <Button>{t('navbar.nav.log_in')}</Button>
                </a>
                <a href="/api/auth/signup">
                  <Button type="primary">{t('navbar.nav.register')}</Button>
                </a>
              </>
            )}
            <LanguageSelect />
            {currentPage === '/exchange' && (
              <div className={styles.settingButton}>
                <ButtonAntd
                  shape="circle"
                  icon={<SettingOutlined />}
                  size="middle"
                  onClick={() => setIsOpenSetting(true)}
                />
              </div>
            )}
            {isOpenSetting && <PopupTradeSetting visible={isOpenSetting} onCancel={() => setIsOpenSetting(false)} />}
          </Space>
        </div>
      </div>
    </Layout.Header>
  );
};
