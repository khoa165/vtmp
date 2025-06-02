import { lowercaseFunction, wrappedHandlersInRouter } from './rules';

export const customPlugin = {
  rules: {
    'lowercase-function': lowercaseFunction,
    'wrapped-handlers-in-router': wrappedHandlersInRouter,
  },
};
