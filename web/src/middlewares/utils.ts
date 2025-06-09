import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@vtmp/common/constants';
import { handleError, UnauthorizedError } from '@/utils/errors';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

interface AuthenticatedServiceRequest extends Request {
  service: {
    role: UserRole;
  };
}

export const getUserFromRequest = (req: Request): AuthenticatedRequest => {
  if (!req.user) {
    throw new UnauthorizedError('User is not authenticated', {});
  }
  return req as AuthenticatedRequest;
};

export const getServiceFromRequest = (
  req: Request
): AuthenticatedServiceRequest => {
  if (!req.service) {
    throw new UnauthorizedError('Service is not authenticated', {});
  }
  return req as AuthenticatedServiceRequest;
};

export const routeErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const { statusCode, errors } = handleError(err);
  res.status(statusCode).json({ errors });
  return;
};

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const wrappedHandlers = (handlers: AsyncRequestHandler[]) => {
  return handlers.map((handler: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
      handler(req, res, next).catch(next);
    };
  });
};
