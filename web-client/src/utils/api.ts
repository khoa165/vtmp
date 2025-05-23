import { Method } from '@/utils/constants';
import axios from 'axios';

const api = axios.create({
  baseURL: 'VITE_API_URL',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RequestBaseArgs<T> {
  method: Method.GET | Method.POST | Method.DELETE | Method.PUT;
  url: string;
  data?: object;
  schema: { parse: (data: object) => T };
}

// Define an interface that defines 2 overloads for the request function
interface IRequest {
  <T extends { data: object }>(
    args: RequestBaseArgs<T> & {
      options: { includeOnlyDataField: true; requireAuth?: boolean };
    }
  ): Promise<T['data']>;

  <T extends { data: object }>(
    args: RequestBaseArgs<T> & {
      options?: {
        includeOnlyDataField?: false | undefined;
        requireAuth?: boolean;
      };
    }
  ): Promise<T>;
}

export const request: IRequest = async <T extends { data: object }>({
  method,
  url,
  data = {},
  schema,
  options = {},
}: {
  method: Method.GET | Method.POST | Method.DELETE | Method.PUT;
  url: string;
  data?: object;
  schema: { parse: (data: object) => T };
  options?: { includeOnlyDataField?: boolean; requireAuth?: boolean };
}): Promise<T['data'] | T> => {
  const { includeOnlyDataField = false } = options;
  const response = await api.request({
    method,
    url,
    ...(method === Method.GET ? { params: data } : { data }),
    headers: {
      ...api.defaults.headers.common,
      ...(options?.requireAuth
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}),
    },
  });
  const parsedData = schema.parse(response.data);

  return includeOnlyDataField ? parsedData.data : parsedData;
};
