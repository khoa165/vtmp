import { AuthType } from '@vtmp/server-common/constants';
import { JWTUtils } from '@vtmp/server-common/utils';
import axios from 'axios';

import { InterviewInsight } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createInterviewInsights = async (
  interviewInsights: InterviewInsight[]
) => {
  const token = JWTUtils.createTokenWithPayload(
    {
      iss: EnvConfig.get().SERVICE_NAME,
      aud: EnvConfig.get().AUDIENCE_SERVICE_NAME,
      authType: AuthType.SERVICE,
    },
    EnvConfig.get().SERVICE_JWT_SECRET
  );
  return api.request({
    method: 'POST',
    url: 'interviews/insights',
    data: interviewInsights,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
