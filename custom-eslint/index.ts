import { enforceSortedEnumKeys } from './rules/enforce-sorted-enum-keys';
import { enforceUppercaseEnumValues } from './rules/enforce-uppercase-enum-values';
import { noTryInControllerOrMiddleware } from './rules/no-try-in-controller-or-middleware';

export const customEslintRules = {
  rules: {
    'no-try-in-controller-or-middleware': noTryInControllerOrMiddleware,
    'enforce-uppercase-enum-values': enforceUppercaseEnumValues,
    'enforce-sorted-enum-keys': enforceSortedEnumKeys,
  },
};
