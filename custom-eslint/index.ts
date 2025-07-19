import { enforceUppercaseEnumValues } from './rules/enforce-uppercase-enum-values';
import { noTryInControllerOrMiddleware } from './rules/no-try-in-controller-or-middleware';
import { wrappedHandlersInRouter } from './rules/wrapped-handlers-in-router';

export const customEslintRules = {
  rules: {
    'no-try-in-controller-or-middleware': noTryInControllerOrMiddleware,
    'enforce-uppercase-enum-values': enforceUppercaseEnumValues,
    'wrapped-handlers-in-router': wrappedHandlersInRouter,
  },
};
