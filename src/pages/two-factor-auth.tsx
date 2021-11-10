import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TwoFactorAuth from 'modules/TwoFactorAuth';

export default TwoFactorAuth;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale as string)),
    },
  };
}
