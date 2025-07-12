import { ErrorInfo } from 'react';
import { toast } from 'sonner';

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const handleError = (error: unknown, info: ErrorInfo) => {
  if (error instanceof CustomError) {
    toast.error(error.message);
    console.error('Custom error caught: ', error.message, error.cause);
  } else {
    toast.error('Unexpected error');
    console.error('Generic error caught: ', error, info);
  }
};
