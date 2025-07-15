import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const noTryInControllerOrMiddleware = createRule<[], 'noTry'>({
  name: 'no-try-in-controller-or-middleware',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow try/catch in controller and middleware layers',
    },
    schema: [],
    messages: {
      noTry:
        'Do not use try/catch in controller or middleware files. Use centralized error handling instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename;

    const isControllerOrMiddleware =
      /[\\/]controller[\\/]/.test(filename) ||
      /[\\/]middleware[\\/]/.test(filename);

    return {
      TryStatement(node) {
        if (isControllerOrMiddleware) {
          context.report({
            node,
            messageId: 'noTry',
          });
        }
      },
    };
  },
});
