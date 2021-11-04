import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';
import { apiBaseUrl } from 'utils/constant';
import auth0 from 'utils/auth0';

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = await auth0.getAccessToken(req, res);

  return await httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: apiBaseUrl,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite: [
      {
        patternStr: '^/api/proxy',
        replaceStr: '',
      },
    ],
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
});
