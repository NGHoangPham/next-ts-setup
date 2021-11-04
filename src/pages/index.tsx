import { useUser } from '@auth0/nextjs-auth0';
import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { user } = useUser();
  return (
    <div className={styles.container}>
      <>
        <h1>Login page</h1>
        {user && (
          <a style={{ padding: 8, background: 'blue', color: '#fff' }} href="/api/auth/logout">
            Logout
          </a>
        )}
        <br />
        <br />
        {!user && (
          <a style={{ padding: 8, background: 'blue', color: '#fff' }} href="/api/auth/login">
            Login
          </a>
        )}
        <Link href="/profile">
          <a style={{ padding: 8, background: 'blue', color: '#fff' }}>Profile</a>
        </Link>
      </>
    </div>
  );
};

export default Home;
