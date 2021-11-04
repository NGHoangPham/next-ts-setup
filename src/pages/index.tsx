import { useUser } from '@auth0/nextjs-auth0';
import { Button } from 'antd';
import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { user } = useUser();
  return (
    <div className={styles.container}>
      <>
        <h1>Login page</h1>
        {user && <Button href="/api/auth/logout">Logout</Button>}
        <br />
        <br />
        {!user && <Button href="/api/auth/login">Login</Button>}
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      </>
    </div>
  );
};

export default Home;
