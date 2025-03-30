export class ResourceNotFoundError extends Error {
  public metadata;
  public statusCode;

  constructor(message: string, metadata: object) {
    super(message);
    this.name = 'ResourceNotFoundError';
    this.metadata = metadata;
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  public metadata;
  public statusCode;

  constructor(message: string, metadata: object) {
    super(message);
    this.name = 'UnauthorizedError';
    this.metadata = metadata;
    this.statusCode = 401;
  }
}
export class ForbiddenError extends Error {
  public metadata;
  public statusCode;

  constructor(message: string, metadata: object) {
    super(message);
    this.name = 'ForbiddenError';
    this.metadata = metadata;
    this.statusCode = 403;
  }
}
