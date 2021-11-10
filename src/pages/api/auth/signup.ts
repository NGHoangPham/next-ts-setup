import { NextApiRequest, NextApiResponse } from 'next';
import auth0 from 'utils/auth0';
export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleLogin(req, res, {
      authorizationParams: {
        // Note that this can be combined with prompt=login , which indicates if
        // you want to always show the authentication page or you want to skip
        // if there’s an existing session.
        screen_hint: 'signUp',
        ref_code: req.query.ref_code,
      },
    });
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
}
