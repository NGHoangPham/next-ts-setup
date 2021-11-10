import { FC, ReactNode } from 'react';
import styles from './UserInfoSelection.module.css';
import clsx from 'clsx';
import { Image, Space, Typography } from 'antd';

import {
  faArrowRight,
  faGift,
  faThLarge,
  faCertificate,
  faPowerOff,
  faUsers,
  faCoins,
  faHistory,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Avatar } from 'components/Avatar';
import { Surface } from 'components/Surface';
import Link from 'next/link';
import { routes } from 'types/routes';
import { useUser } from '@auth0/nextjs-auth0';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Text } = Typography;

const UserInfo: FC = ({ children }) => (
  <Space align="start" size={16}>
    <div className={styles.certificateIcon}>
      <FontAwesomeIcon icon={faCertificate} className={styles.icon} color="var(--orange-main)" />
    </div>
    {children}
  </Space>
);

interface ItemSelectionProps {
  title: ReactNode | 'string';
  active?: boolean;
  icon: IconProp;
  onClick?: () => void;
  isLogoutBtn?: boolean;
}

const ItemSelection: FC<ItemSelectionProps> = ({ onClick, title, icon, active, isLogoutBtn }) => (
  <Space onClick={() => onClick && onClick()} className={styles.item} size={16} align="center">
    <Text className={clsx(active && 'primary')}>{title}</Text>
    <FontAwesomeIcon
      icon={icon}
      color={active ? 'var(--orange-main)' : isLogoutBtn ? '#9AA3A7' : '#fff'}
      className={styles.icon}
    />
  </Space>
);

const items = [
  {
    icon: faThLarge,
    title: 'account management',
    path: routes.accountManagement,
  },
  {
    icon: faGift,
    title: 'reward center',
    path: routes.rewardCenter,
  },
  {
    icon: faUsers,
    title: 'referral dashboard',
    path: routes.referral,
  },
  {
    icon: faCoins,
    title: 'earnings',
    path: routes.earnings,
  },
  {
    icon: faHistory,
    title: 'history',
    path: routes.history,
  },
  {
    icon: faWallet,
    title: 'sub accounts',
    path: routes.subAccount,
  },
];

export const UserInfoSelection: FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const isActive = (path: string = '') => {
    if (path === router.pathname) {
      return true;
    }
    return false;
  };

  return (
    <Surface borderMd className={styles.root}>
      <Avatar
        className={styles.avatar}
        size={52}
        src={user ? <Image alt="avatar" src={user.picture || ''} /> : ''}
        icon={<UserOutlined />}
      />
      <Space className="cursor" direction="vertical" align="end" size={0}>
        <Link href={routes.dashboard}>
          <a>
            <ItemSelection
              icon={faArrowRight}
              title={
                <UserInfo>
                  <Text className={clsx(isActive(routes.dashboard) && 'primary')}>{user?.email}</Text>
                </UserInfo>
              }
              active={isActive(routes.dashboard)}
            />
          </a>
        </Link>
      </Space>

      <div className="divider-x" />

      {items.map((item, index) => (
        <Link href={item.path} key={index}>
          <a>
            <ItemSelection active={isActive(item.path)} {...item} />
          </a>
        </Link>
      ))}
      <a href="/api/auth/logout">
        <ItemSelection
          active={false}
          icon={faPowerOff}
          title={<Text type="secondary">log out</Text>}
          isLogoutBtn={true}
        />
      </a>
    </Surface>
  );
};
