import { LinkProcessStage } from '@vtmp/common/constants';

export abstract class ServiceSpecificError extends Error {
  public metadata: { url: string };
  public linkProcessingStatus: LinkProcessStage;
  constructor(
    message: string,
    metadata: { url: string },
    linkProcessingStatus: LinkProcessStage,
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.linkProcessingStatus = linkProcessingStatus;
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

export class LinkValidationError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(message, metadata, LinkProcessStage.VALIDATION_FAILED, options);
  }
}

export class ScrapingError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(message, metadata, LinkProcessStage.SCRAPING_FAILED, options);
  }
}

export class AIExtractionError extends ServiceSpecificError {
  constructor(
    message: string,
    metadata: { url: string },
    options?: { cause?: unknown }
  ) {
    super(message, metadata, LinkProcessStage.EXTRACTION_FAILED, options);
  }
}

export class AIResponseEmptyError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessStage.EXTRACTION_FAILED);
  }
}

export class InvalidJsonError extends ServiceSpecificError {
  constructor(message: string, metadata: { url: string }) {
    super(message, metadata, LinkProcessStage.EXTRACTION_FAILED);
  }
}

export const handleError = (
  error: unknown,
  url: string
): {
  url: string;
  linkProcessingStatus: LinkProcessStage;
} => {
  let linkProcessingStatus: LinkProcessStage =
    LinkProcessStage.VALIDATION_FAILED;

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
    linkProcessingStatus = LinkProcessStage.UNKNOWN_FAILED;
  } else {
    linkProcessingStatus = LinkProcessStage.UNKNOWN_FAILED;
  }

  console.error(error);
  return { url, linkProcessingStatus };
};
