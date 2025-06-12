import { wrappedHandlersInRouter } from './rules/wrapped-handlers-in-router';

export const customEslintRules = {
  rules: {
    'wrapped-handlers-in-router': wrappedHandlersInRouter,
  },
};
