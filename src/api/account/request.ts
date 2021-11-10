import { authRequest } from 'api/axios';
import { TChangeNickName, TChangeNickNameResponse } from './types';

export const changeNickName = async (request: TChangeNickName): Promise<TChangeNickNameResponse> => {
  const { data } = await authRequest.post(`/consumer/edit/nickName`, request);
  return data;
};
