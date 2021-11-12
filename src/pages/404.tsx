import { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="page_notfound_container">
      <h1>404 - Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;

export async function getStaticProps(ctx: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale as string)),
    },
  };
}
