import { LinkProcessingFailureStage } from '@vtmp/common/constants';
import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

export abstract class ServiceSpecificError extends Error {
  public metadata: { urls: string[] };
  public failureStage: LinkProcessingFailureStage;
  constructor(
    message: string,
    metadata: { urls: string[] },
    failureStage: LinkProcessingFailureStage,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.failureStage = failureStage;
  }
}

export class LinkValidationError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { urls: string[] },
    options?: { cause?: unknown }
  ) {
    super(
      message,
      metadata,
      LinkProcessingFailureStage.VALIDATION_FAILED,
      options
    );
  }
}

export class ScrapingError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { urls: string[] },
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
    metadata: { urls: string[] },
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
  constructor(message: string, metadata: { urls: string[] }) {
    super(message, metadata, LinkProcessingFailureStage.EXTRACTION_FAILED);
  }
}

export class InvalidJsonError extends ServiceSpecificError {
  constructor(message: string, metadata: { urls: string[] }) {
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
  > = async (request) => {
    const error = request.error;
    logError(error);
    console.error('Error cause: ', error?.cause);

    if (error instanceof SyntaxError) {
      // Error thrown due to malformed JSON string that failed JSON.parse
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Malformed JSON in request body',
          failureStage: LinkProcessingFailureStage.PRE_VALIDATION_FAILED,
        }),
      };
      return;
    } else if (error instanceof ZodError) {
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
