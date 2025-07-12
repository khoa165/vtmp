import { AuthType } from '@vtmp/server-common/constants';
import { JWTUtils } from '@vtmp/server-common/utils';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { SystemRole } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { AllowedIssuer } from '@/constants/enums';
import { UserService } from '@/services/user.service';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';

export const DecodedJWTSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  authType: z.nativeEnum(AuthType),
});

const TokenPayloadSchema = z.union([
  DecodedJWTSchema,
  z.object({
    iss: z.string(),
    aud: z.string(),
    authType: z.nativeEnum(AuthType),
  }),
]);

const getDecodedJWTServiceSchema = () =>
  z.object({
    iss: z.nativeEnum(AllowedIssuer),
    aud: z.literal(EnvConfig.get().SERVICE_NAME),
    authType: z.nativeEnum(AuthType),
  });

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Unauthorized', {});
  }

  // Decode token without verifying to inspect payload
  // To determine if the token is for service-to-service authentication or not
  // This does not verify the signature (with a secret) or check if it expires
  let decoded;
  try {
    decoded = JWTUtils.peekAndParseToken(token, TokenPayloadSchema);
  } catch {
    // If Zod throws or jwt.decode returns null, treat as unauthorized
    throw new UnauthorizedError('jwt malformed', {});
  }

  if (decoded.authType === AuthType.USER) {
    const parsed = JWTUtils.verifyAndParseToken(
      token,
      DecodedJWTSchema,
      EnvConfig.get().JWT_SECRET
    );

    try {
      const user = await UserService.getUserById(parsed.id);
      req.user = { id: String(user._id), role: user.role };
    } catch (error) {
      if (error instanceof ResourceNotFoundError)
        throw new UnauthorizedError('User not found', {});
      throw error;
    }
  } else {
    const parsed = JWTUtils.verifyAndParseToken(
      token,
      getDecodedJWTServiceSchema(),
      EnvConfig.get().SERVICE_JWT_SECRET
    );

    // Check if parsed have allowed issuer
    if (!Object.values(AllowedIssuer).includes(parsed.iss)) {
      throw new UnauthorizedError('Unknown issuer', { issuer: parsed.iss });
    }
    // Check if parsed have correct audience
    if (parsed.aud !== EnvConfig.get().SERVICE_NAME) {
      throw new UnauthorizedError('Incorrect audience', {
        audience: parsed.aud,
      });
    }

    req.service = { role: SystemRole.SERVICE };
  }
  next();
};
