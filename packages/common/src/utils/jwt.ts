import jwt from 'jsonwebtoken';

export const JWTUtils = {
  createTokenWithPayload: (
    payload: string | Buffer | object,
    secret: string,
    options?: jwt.SignOptions
  ): string => {
    return jwt.sign(payload, secret, options);
  },

  verifyAndParseToken: <T>(
    token: string,
    schema: { parse: (data: unknown) => T },
    secret: string
  ): T => {
    const verified = jwt.verify(token, secret);
    return schema.parse(verified);
  },

  peekAndParseToken: <T>(
    token: string,
    schema: { parse: (data: unknown) => T }
  ) => {
    const decoded = jwt.decode(token);
    return schema.parse(decoded);
  },
};
