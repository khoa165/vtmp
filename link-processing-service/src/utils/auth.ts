import { EnvConfig } from '@/config/env';
import axios from 'axios';

let jwtToken: string | undefined;

const api = axios.create({
  baseURL: `${EnvConfig.get().API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getJwtToken = async () => {
  if (jwtToken) return jwtToken;

  const response = await api.request({
    method: 'POST',
    url: '/auth/login',
    data: {
      email: EnvConfig.get().LOGIN_EMAIL,
      // password: EnvConfig.get().LOGIN_PASSWORD,
    },
  });

  jwtToken = response.data.data.token;
  return jwtToken;
};

export const postWithAuthRetry = async (url: string, data: unknown) => {
  let token = await getJwtToken();
  try {
    return await api.request({
      method: 'POST',
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 401
    ) {
      jwtToken = undefined; // Clear token and retry
      token = await getJwtToken();
      return await api.request({
        method: 'POST',
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      throw error;
    }
  }
};
