import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

export abstract class ServiceSpecificError extends Error {
  public metadata: object;
  public statusCode: number;

  constructor(message: string, metadata: object, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }
}

export class BadRequest extends ServiceSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 400);
  }
}

export class InternalServerError extends ServiceSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 500);
  }
}

export function logError(error: unknown): void {
  if (error instanceof ServiceSpecificError) {
    console.error('ServiceSpecificError:', error);
    if (error.cause instanceof Error) {
      console.error('Error cause:', error.cause);
    }
  } else if (error instanceof Error) {
    console.error('General error:', error);
    if (error.cause instanceof Error) {
      console.error('Error cause:', error.cause);
    }
  } else {
    console.error('Unknown error:', error);
  }
}

export const handleErrorMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResult
> => {
  const onError: middy.MiddlewareFn<
    APIGatewayProxyEventV2,
    APIGatewayProxyResult
  > = async (
    request: middy.Request<APIGatewayProxyEventV2, APIGatewayProxyResult>
  ) => {
    const error = request.error;
    logError(error);

    if (error instanceof ZodError) {
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid request body shape',
        }),
      };
    } else {
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Unknown Server Error',
        }),
      };
    }
  };

  return {
    onError,
  };
};
