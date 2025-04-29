import { Method } from '@/utils/constants';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const request = async <T>(
  method: Method.GET | Method.POST | Method.DELETE | Method.PUT,
  url: string,
  data?: unknown,
  schema?: { parse: (data: unknown) => T }
): Promise<T> => {
  const response = await api.request({
    method,
    url,
    data,
  });

  console.log(response.data);
  if (schema) {
    return schema.parse(response.data);
  }

  return response.data;
};
