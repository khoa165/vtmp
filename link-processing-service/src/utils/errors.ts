import { LinkProcessingSubStatus } from '@vtmp/common/constants';
import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

export abstract class ServiceSpecificError extends Error {
  public metadata: { url: string };
  public linkProcessingStatus: LinkProcessingSubStatus;
  constructor(
    message: string,
    metadata: { url: string },
    linkProcessingStatus: LinkProcessingSubStatus,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.linkProcessingStatus = linkProcessingStatus;
  }
}

export class LinkValidationError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(
      message,
      metadata,
      LinkProcessingSubStatus.VALIDATION_FAILED,
      options
    );
  }
}

export class ScrapingError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(message, metadata, LinkProcessingSubStatus.SCRAPING_FAILED, options);
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
      LinkProcessingSubStatus.EXTRACTION_FAILED,
      options
    );
  }
}

export class AIResponseEmptyError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessingSubStatus.EXTRACTION_FAILED);
  }
}

export class InvalidJsonError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessingSubStatus.EXTRACTION_FAILED);
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

    if (error instanceof SyntaxError) {
      // Error thrown due to malformed JSON string that failed JSON.parse
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Malformed JSON in request body',
          linkProcessingStatus: LinkProcessingSubStatus.PRE_VALIDATION_FAILED,
        }),
      };
      return;
    } else if (error instanceof ZodError) {
      request.response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid request body shape',
          linkProcessingStatus: LinkProcessingSubStatus.PRE_VALIDATION_FAILED,
        }),
      };
    } else if (error instanceof ServiceSpecificError) {
      request.response = {
        statusCode: 500,
        body: JSON.stringify({
          message: error.message,
          linkProcessingStatus: error.linkProcessingStatus,
        }),
      };
    } else {
      request.response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal server error',
          linkProcessingStatus: LinkProcessingSubStatus.UNKNOWN_FAILED,
        }),
      };
    }
  };

  return {
    onError,
  };
};
