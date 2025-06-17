import { EnvConfig } from '@/config/env';
import { MetadataPipelineResult } from '@/services/web-scraping.service';
import axios from 'axios';
import { JWTUtils } from '@vtmp/server-common/utils';
import { AuthType } from '@vtmp/server-common/constants';

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitLinkWithToken = async (
  url: string,
  data: MetadataPipelineResult
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
