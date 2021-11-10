import { FC, useEffect } from 'react';
import { LoadingFullpage } from 'components/Loading';

const RegisterPage: FC = () => {
  useEffect(() => {
    const refCode = new URL(window.location.href).searchParams.get('ref') || '';
    window.location.href = `/api/auth/signup?ref_code=${refCode}`;
  }, []);

  return <LoadingFullpage />;
};

export default RegisterPage;
