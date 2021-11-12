import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import auth0 from 'utils/auth0';
import { apiBaseUrl } from 'utils/constant';

const app = express();

app.use('*', async (req, res, next) => {
  try {
    const { accessToken } = await auth0.getAccessToken(req, res);

    return createProxyMiddleware({
      target: apiBaseUrl,
      changeOrigin: true,
      proxyTimeout: 5000,
      secure: false,
      headers: {
        Connection: 'keep-alive',
        Authorization: `Bearer ${accessToken}`,
      },
      pathRewrite: {
        '^/api/proxy': '',
      },
      onError: (err, req, res) => {
        console.log('err', err);
        res.writeHead(res.statusCode, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
      },
      onProxyReq: async (proxyReq, req: any) => {
        if (accessToken) {
          proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
        }

        if (req.body) {
          // let bodyData = JSON.stringify(req.body);
          // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
          // proxyReq.setHeader('Content-Type', 'application/json');
          // proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          // stream the content
          proxyReq.write(req.body);
        }
      },
    })(req, res, next);
  } catch (err: any) {
    if (err.code === 'invalid_session') {
      return res.status(401).send({
        message: 'Unauthorizes',
      });
    }
    res.end('Something went wrong. And we are reporting a custom error message.');
  }
});

export default app;
