import { Method } from '@/utils/constants';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Base interface
interface RequestBaseArgs<T> {
  method: Method.GET | Method.POST | Method.DELETE | Method.PUT;
  url: string;
  data?: object;
  schema: { parse: (data: object) => T };
}

// Define an interface that defines 2 overloads for the request function
// Overloads allow function to have multiple call signature, depending on arguments passed to it
interface IRequest {
  // First overload: if options.includeOnlyData is true
  // Return only the data field from parsed response
  <T extends { data: object; message: string }>(
    args: RequestBaseArgs<T> & { options: { includeOnlyDataField: true } }
  ): Promise<T['data']>;

  // Second overload: if options.includeOnlyData is false or not provided
  // Return the entire parsed response object
  <T extends { data: object; message: string }>(
    args: RequestBaseArgs<T> & {
      options?: { includeOnlyDataField?: false | undefined };
    }
  ): Promise<T>;
}

// Implementation of the function using the interface IRequest
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
  const parsedData = schema.parse(response.data);

  return includeOnlyDataField ? parsedData.data : parsedData;
};
