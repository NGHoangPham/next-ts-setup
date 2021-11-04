import { UserContext } from '@auth0/nextjs-auth0';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/dist/frontend';
import axios from 'axios';
import { FC } from 'react';
import { apiBaseUrl } from '../utils/constant';

interface ProfilePageProps {
  user: UserContext;
}

const ProfilePage: FC<ProfilePageProps> = ({ user }) => {
  console.log({ user });

  const handleGet = async () => {
    const { data } = await axios('/api/proxy/bb/symbol/list');
    console.log({ data });
  };

  const handleGetImediately = async () => {
    const { data } = await axios(`${apiBaseUrl}/api/proxy/bb/symbol/list`, {
      headers: {
        authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkpSN01ZSkFDd2h4LW1SYzFRcjRTcCJ9.eyJpc3MiOiJodHRwczovL2xvY2FsLWh2aG5oZzF1LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MTgyMTVjMjg5Y2M4ZTAwNzBkZTVkZWEiLCJhdWQiOlsiaHR0cHM6Ly91bHRvcmV4Lm9yZyIsImh0dHBzOi8vbG9jYWwtaHZobmhnMXUudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYzNTkyODg3NCwiZXhwIjoxNjM2MDE1Mjc0LCJhenAiOiJ0d1BzeFRDNDBTNFZ1Z1RhdjhXbDMxTUtteTRvVXpaeiIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.DjHuguqzdamnF-6T9scJwsQCFwDF_QZh6rl2EShrcBpAeqx-JZMQcGIkVOlQTB995CzimhhaxE-GpWQrqVrau6TPKD99YxyWZBHqf4ecT7jKXs7Z94jHpOa2QX-oOQk1PWqfzwijBNh8Pp-6ft4Xpgxr-0_7neMlTnBVTOkTkYWDCbbiq0Y6HElt-BPb25TIQ_VeDRNEzV2uvMWqVr24zbLBRjSyNILeIIVPhePffWwuFpLm-wHsqgzjb_MDDlS-zZBda-xb_TvYN2LLaxZln1F_gnbJvTfTRp_557RpQTfX2sJB0CdwDpAk8P5O5I7gvJ00wiAE6DM7_8cZPgPtiw`,
      },
    });
    console.log({ data });
  };

  return (
    <>
      <div>{JSON.stringify(user)}</div>
      <button onClick={handleGet}>Get Proxy</button>
      <button onClick={handleGetImediately}>Get Imediately</button>
    </>
  );
};

export default withPageAuthRequired(ProfilePage);
