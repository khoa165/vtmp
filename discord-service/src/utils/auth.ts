import { EnvConfig } from '@/config/env';
import { AuthType } from '@vtmp/common/constants';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const createServiceToken = (issuer: string, audience: string): string => {
  return jwt.sign(
    { iss: issuer, aud: audience, authType: AuthType.SERVICE },
    EnvConfig.get().SERVICE_JWT_SECRET
  );
};

export const submitLinkWithToken = async (
  url: string,
  data: { url: string }
) => {
  const token = createServiceToken(
    EnvConfig.get().SERVICE_NAME,
    EnvConfig.get().AUDIENCE_SERVICE_NAME
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
