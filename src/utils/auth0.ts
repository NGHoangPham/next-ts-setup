import { initAuth0 } from '@auth0/nextjs-auth0';
import { baseUrl } from './constant';

export default initAuth0({
  baseURL: baseUrl,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  clockTolerance: 60,
  httpTimeout: 5000,
  authorizationParams: {
    scope: 'openid profile email offline_access',
    audience: process.env.AUTH0_CLIENT_AUDIENCE,
  },
  routes: {
    callback: process.env.REDIRECT_URI,
    postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT_URI,
  },
  session: {
    rollingDuration: 60 * 60 * 24, // second
    absoluteDuration: 60 * 60 * 24 * 7, // second
  },
});
