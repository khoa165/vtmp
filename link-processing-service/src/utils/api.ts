import { EnvConfig } from '@/config/env';
import axios from 'axios';
import { JWTUtils } from '@vtmp/server-common/utils';
import { AuthType } from '@vtmp/server-common/constants';
import { UpdateLinkPayload } from '@/services/link-metadata-validation';

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateLink = async (url: string, data: UpdateLinkPayload) => {
  const token = JWTUtils.createTokenWithPayload(
    {
      iss: EnvConfig.get().SERVICE_NAME,
      aud: EnvConfig.get().AUDIENCE_SERVICE_NAME,
      authType: AuthType.SERVICE,
    },
    EnvConfig.get().SERVICE_JWT_SECRET
  );
  return api.request({
    method: 'PUT',
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
