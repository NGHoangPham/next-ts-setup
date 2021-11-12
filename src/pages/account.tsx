import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AccountManagementPage from 'modules/AccountManagementPage';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/dist/frontend';

export default withPageAuthRequired(AccountManagementPage);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale as string)),
    },
  };
}
