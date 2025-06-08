import {
  enforceUppercaseEnumValues,
  noRequireFunctionCalls,
  noTryInControllerOrMiddleware,
} from './rules';

export const rulesCustom = {
  rules: {
    'no-require-function-calls': noRequireFunctionCalls,
    'no-try-in-controller-or-middleware': noTryInControllerOrMiddleware,
    'enforce-uppercase-enum-values': enforceUppercaseEnumValues,
  },
};
