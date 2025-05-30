import { explicitGenerics, lowercaseFunction } from './rules';

export const customPlugin = {
  rules: {
    'explicit-generics': explicitGenerics,
    'lowercase-function': lowercaseFunction,
  },
};
