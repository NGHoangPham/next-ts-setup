import { FC, useEffect } from 'react';
import { LoadingFullpage } from 'components/Loading';

const LoginPage: FC = () => {
  useEffect(() => {
    window.location.href = '/api/auth/login';
  }, []);
  return <LoadingFullpage />;
};

export default LoginPage;
