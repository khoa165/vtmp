import { NextFunction, Request, Response } from 'express';

import { SystemRole } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { Logger } from '@/config/logger';
import {
  ApplicationSpecificError,
  handleError,
  UnauthorizedError,
} from '@/utils/errors';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: SystemRole;
  };
}

interface AuthenticatedServiceRequest extends Request {
  service: {
    role: SystemRole;
  };
}

export const getUserFromRequest = (
  req: Request
): AuthenticatedRequest['user'] => {
  if (!req.user) {
    throw new UnauthorizedError('User is not authenticated', {});
  }
  return (req as AuthenticatedRequest).user;
};

export const safelyGetUserFromRequest = (
  req: Request
): AuthenticatedRequest['user'] | null => {
  return req.user ?? null;
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
  req: Request,
  res: Response,

  _next: NextFunction
) => {
  const extra = {
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    environment: EnvConfig.get().NODE_ENV,
  };

  if (err instanceof ApplicationSpecificError) {
    console.log('should log here in utils.ts error handler');
    Logger.error(err.message, {
      ...extra,
      statusCode: err.statusCode,
      metadata: err.metadata,
      userId: 123,
      treverseId: 456,
    });
  }

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
