export class ApplicationSpecificError extends Error {
  public metadata: object;
  public statusCode: number;

  constructor(message: string, metadata: object, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }
}

export class ResourceNotFoundError extends ApplicationSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 404);
  }
}

export class UnauthorizedError extends ApplicationSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 401);
  }
}

export class ForbiddenError extends ApplicationSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 403);
  }
}

export class DuplicateResourceError extends ApplicationSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 409);
  }
}
