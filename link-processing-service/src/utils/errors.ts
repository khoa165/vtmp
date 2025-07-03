import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

import { LinkProcessingFailureStage } from '@vtmp/common/constants';

import { LinkValidationErrorType } from '@/utils/errors-enum';

export abstract class ServiceSpecificError extends Error {
  public metadata: { url: string };
  public failureStage: LinkProcessingFailureStage;
  constructor(
    message: string,
    metadata: { url: string },
    failureStage: LinkProcessingFailureStage,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.failureStage = failureStage;
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export class LinkValidationError extends ServiceSpecificError {
  public statusCode?: number;
  public errorType: LinkValidationErrorType;
  constructor(
    message: string,
    errorType: LinkValidationErrorType,
    metadata: { url: string },
    options?: {
      cause?: unknown;
      statusCode?: number;
    }
  ) {
    super(
      message,
      metadata,
      LinkProcessingFailureStage.VALIDATION_FAILED,
      options
    );
    this.errorType = errorType;
    if (options?.statusCode) {
      this.statusCode = options?.statusCode;
    }
  }
}

export class ScrapingError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(
      message,
      metadata,
      LinkProcessingFailureStage.SCRAPING_FAILED,
      options
    );
  }
}

export class AIExtractionError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(
      message,
      metadata,
      LinkProcessingFailureStage.EXTRACTION_FAILED,
      options
    );
  }
}

export class AIResponseEmptyError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessingFailureStage.EXTRACTION_FAILED);
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

    // Error thrown if does not pass EventBodySchema
    if (error instanceof ZodError) {
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid request body shape',
          failureStage: LinkProcessingFailureStage.PRE_VALIDATION_FAILED,
        }),
      };
    } else if (error instanceof ServiceSpecificError) {
      request.response = {
        statusCode: 500,
        body: JSON.stringify({
          message: error.message,
          failureStage: error.failureStage,
        }),
      };
    } else {
      request.response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal server error',
          failureStage: LinkProcessingFailureStage.UNKNOWN_FAILED,
        }),
      };
    }
  };

  return {
    onError,
  };
};
