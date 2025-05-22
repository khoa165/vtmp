import mongoSanitize from 'express-mongo-sanitize';

export const SanitizeMiddileWare = () =>
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  });
