import { Method } from '@/utils/constants';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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
  <T extends { data: object; message: string }>(
    args: RequestBaseArgs<T> & { options: { includeOnlyDataField: true } }
  ): Promise<T['data']>;

  <T extends { data: object; message: string }>(
    args: RequestBaseArgs<T> & {
      options?: { includeOnlyDataField?: false | undefined };
    }
  ): Promise<T>;
}

export const request: IRequest = async <
  T extends { data: object; message: string },
>({
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
  options?: { includeOnlyDataField?: boolean };
}): Promise<T['data'] | T> => {
  const { includeOnlyDataField = false } = options;
  const response = await api.request({
    method,
    url,
    ...(method === Method.GET ? { params: data } : { data }),
  });
  console.log(response.data);

  const parsedData = schema.parse(response.data);

  return includeOnlyDataField ? parsedData.data : parsedData;
};
