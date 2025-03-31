import { ZodError } from 'zod';
import {
  ForbiddenError,
  ResourceNotFoundError,
  UnauthorizedError,
} from './errors';

const errorsHandler = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      status: 400,
      errors: error.issues.map((issue) => ({
        message: issue.message,
      })),
    };
  } else if (
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof ResourceNotFoundError
  ) {
    return { status: error.statusCode, errors: [{ message: error.message }] };
  } else {
    return { status: 500, errors: [{ message: 'Unknown server error' }] };
  }
};

export default errorsHandler;
