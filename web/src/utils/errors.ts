import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';

export abstract class ApplicationSpecificError extends Error {
  public metadata: object;
  public statusCode: number;

  constructor(message: string, metadata: object, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApplicationSpecificError {
  constructor(message:string, metadata: object = {}) {
    super(message, metadata, 400);
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

export class InternalServerError extends ApplicationSpecificError {
  constructor(message: string, metadata: object) {
    super(message, metadata, 500);
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      errors: error.issues.map((issue) => ({
        message: issue.message,
      })),
    };
  } else if (error instanceof jwt.JsonWebTokenError) {
    return {
      statusCode: 401,
      errors: [{ message: error.message }],
    };
  } else if (error instanceof ApplicationSpecificError) {
    return {
      statusCode: error.statusCode,
      errors: [{ message: error.message }],
    };
  } else {
    return { statusCode: 500, errors: [{ message: 'Unknown server error' }] };
  }
};
