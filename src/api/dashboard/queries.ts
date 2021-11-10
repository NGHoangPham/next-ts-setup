import { useQuery, UseQueryOptions } from 'react-query';
import { authRequest } from 'api/axios';
import { TReferralRankResponse, TReferralCountResponse } from './types';

export const useReferralRank = (options?: UseQueryOptions<any>) => {
  return useQuery<TReferralRankResponse>(
    '/consumer/referral_rank',
    async () => {
      const { data } = await authRequest.post(`/consumer/referral_rank`);
      return data;
    },
    options
  );
};

export const useReferralCount = (options?: UseQueryOptions<any>) => {
  return useQuery<TReferralCountResponse>(
    '/consumer/referrals/new_count',
    async () => {
      const { data } = await authRequest.post(`/consumer/referrals/new_count`);
      return data;
    },
    options
  );
};
