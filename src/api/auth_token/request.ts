import { authRequest } from 'api/axios';

export const getAuthToken = async (): Promise<any> => {
  const { data } = await authRequest.post(`/consumer/gain/authToken`);
  return data;
};
