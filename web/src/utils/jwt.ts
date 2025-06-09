import jwt from 'jsonwebtoken';
import { EnvConfig } from '@/config/env';

export const JWTUtils = {
  createTokenWithPayload: (
    payload: string | Buffer | object,
    options?: jwt.SignOptions
  ): string => {
    return jwt.sign(payload, EnvConfig.get().JWT_SECRET, options);
  },

  decodeAndParseToken: <T>(
    token: string,
    schema: { parse: (data: unknown) => T },
    secret: string
  ): T => {
    const verified = jwt.verify(token, secret);
    return schema.parse(verified);
  },

  peekTokenPayload: <T>(
    token: string,
    schema: { parse: (data: unknown) => T }
  ) => {
    const decoded = jwt.decode(token);
    return schema.parse(decoded);
  },
};
