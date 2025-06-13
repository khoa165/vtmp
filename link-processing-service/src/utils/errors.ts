export enum LinkProcessingStatus {
  FAILED_VALIDATION = 'VALIDATION_FAILED',
  FAILED_SCRAPING = 'FAILED_SCRAPING',
  FAILED_AI_EXTRACTION = 'FAILED_AI_EXTRACTION',
  FAILED_UNKNOWN = 'FAILED_UNKNOWN',
  SUCCESS = 'SUCCESS',
}
export abstract class ServiceSpecificError extends Error {
  public metadata: { url: string };
  public linkProcessingStatus: LinkProcessingStatus;
  public statusCode?: number;
  constructor(
    message: string,
    metadata: { url: string },
    linkProcessingStatus: LinkProcessingStatus,
    options?: { cause?: unknown; statusCode?: number }
  ) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.linkProcessingStatus = linkProcessingStatus;
    if (options?.cause) {
      this.cause = options.cause;
    }
    if (options?.statusCode) {
      this.statusCode = options.statusCode;
    }
  }
}

export class LinkValidationError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown; statusCode?: number }
  ) {
    super(message, metadata, LinkProcessingStatus.FAILED_VALIDATION, options);
  }
}

export class ScrapingError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(message, metadata, LinkProcessingStatus.FAILED_SCRAPING, options);
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
      LinkProcessingStatus.FAILED_AI_EXTRACTION,
      options
    );
  }
}

export class AIResponseEmptyError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessingStatus.FAILED_AI_EXTRACTION);
  }
}

export class InvalidJsonError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessingStatus.FAILED_AI_EXTRACTION);
  }
}

export const handleError = (
  error: unknown,
  url: string
): {
  url: string;
  linkProcessingStatus: LinkProcessingStatus;
} => {
  let linkProcessingStatus: LinkProcessingStatus =
    LinkProcessingStatus.FAILED_VALIDATION;

  if (error instanceof ServiceSpecificError) {
    console.log('Error message: ', error.message);
    linkProcessingStatus = error.linkProcessingStatus;
    if (error.cause instanceof Error) {
      console.error('Error cause: ', error.cause);
      console.log('Error cause message: ', error.cause.message);
    }
  } else if (error instanceof Error) {
    if (error.cause instanceof Error) {
      console.error('Error cause: ', error.cause);
      console.log('Error cause message: ', error.cause.message);
    }
    linkProcessingStatus = LinkProcessingStatus.FAILED_UNKNOWN;
  } else {
    linkProcessingStatus = LinkProcessingStatus.FAILED_UNKNOWN;
  }

  console.error(error);
  return { url, linkProcessingStatus };
};
