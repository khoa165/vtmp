import mongoSanitize from 'express-mongo-sanitize';

export const sanitizeMiddileWare = () =>
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request [${key}] is sanitized`, req);
    },
  });
