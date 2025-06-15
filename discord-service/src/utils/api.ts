import { EnvConfig } from '@/config/env';
import { AuthType } from '@vtmp/common/constants';
import axios from 'axios';
import { JWTUtils } from '@vtmp/common/utils/server';

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitLinkWithToken = async (
  url: string,
  data: { url: string }
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
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
