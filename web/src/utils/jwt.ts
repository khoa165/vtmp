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
    schema: { parse: (data: unknown) => T }
  ): T => {
    const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);
    return schema.parse(decoded);
  },
};

