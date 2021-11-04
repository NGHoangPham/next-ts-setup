import { useUser } from '@auth0/nextjs-auth0';
import React from 'react';

const LoginPage = () => {
  return (
    <div>
      <h1>Login page</h1>
      <a href="/api/auth/login">Logout</a>
      <a href="/api/auth/logout">Login</a>
    </div>
  );
};

export default LoginPage;
