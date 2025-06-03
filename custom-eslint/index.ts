import { lowercaseFunction, wrappedHandlersInRouter } from './rules';

export const customEslintRules = {
  rules: {
    'lowercase-function': lowercaseFunction,
    'wrapped-handlers-in-router': wrappedHandlersInRouter,
  },
};
