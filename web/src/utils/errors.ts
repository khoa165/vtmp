class CustomError extends Error {
  public metadata: object;
  public statusCode: number;

  constructor(message: string, metadata: object, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }
}

class ResourceNotFoundError extends CustomError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 404);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 403);
  }
}

class DuplicateResourceError extends CustomError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 409);
  }
}

export {
  CustomError,
  ResourceNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DuplicateResourceError,
};
