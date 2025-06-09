import { JWTUtils } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import UserService from '@/services/user.service';
import { EnvConfig } from '@/config/env';
import { UserRole } from '@vtmp/common/constants';

enum ALLOWED_ISSUER {
  DISCORD_SERVICE = 'discord-service',
  LINK_PROCESSING_SERVICE = 'link-processing-service',
}

export const DecodedJWTSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
});

export const TokenPayloadSchema = z.union([
  DecodedJWTSchema,
  z.object({
    iss: z.string(),
    aud: z.string(),
  }),
]);

export const DecodedJWTServiceSchema = z.object({
  iss: z.nativeEnum(ALLOWED_ISSUER),
  aud: z.literal(EnvConfig.get().SERVICE_NAME),
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
    decoded = JWTUtils.peekTokenPayload(token, TokenPayloadSchema);
  } catch {
    // If Zod throws or jwt.decode returns null, treat as unauthorized
    throw new UnauthorizedError('jwt malformed', {});
  }

  if (!decoded) throw new UnauthorizedError('Empty jwt payload', {});

  // Now check if decoded has field .id, which means it is from a human 'user'
  if ('id' in decoded) {
    const parsed = JWTUtils.decodeAndParseToken(
      token,
      DecodedJWTSchema,
      EnvConfig.get().JWT_SECRET
    );
    const user = await UserService.getUserById(parsed.id);

    req.user = { id: String(user._id), role: user.role };
  } else {
    const parsed = JWTUtils.decodeAndParseToken(
      token,
      DecodedJWTServiceSchema,
      EnvConfig.get().SERVICE_JWT_SECRET
    );
    // Check if parsed have correct issuer and audience
    if (!Object.values(ALLOWED_ISSUER).includes(parsed.iss)) {
      throw new UnauthorizedError('Unknown issuer', { issuer: parsed.iss });
    }
    if (parsed.aud !== 'web') {
      throw new UnauthorizedError('Incorrect audience', {
        audience: parsed.aud,
      });
    }
    req.service = { role: UserRole.ADMIN };
  }
  next();

  // const parsed = JWTUtils.decodeAndParseToken(
  //   token,
  //   DecodedJWTSchema,
  //   EnvConfig.get().JWT_SECRET
  // );
  // const user = await UserService.getUserById(parsed.id);

  // req.user = { id: String(user._id), role: user.role };

  // next();
};
