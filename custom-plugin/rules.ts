import { ESLintUtils } from '@typescript-eslint/utils';

type MessageIds = 'default';

type Options = { functionNames: string[] }[];

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const explicitGenerics = createRule<Options, MessageIds>({
  name: 'explicit-generics',
  meta: {
    docs: {
      description:
        'Enforces that certain functions must have their TypeScript generics inputs be provided',
    },
    messages: {
      default: "'{{callee}}' should include generics in function call",
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          functionNames: {
            type: 'array',
            items: [
              {
                type: 'string',
              },
            ],
            uniqueItems: true,
          },
        },
      },
    ],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          context.options[0]!.functionNames.includes(node.callee.name)
        ) {
          if (!node.typeArguments) {
            context.report({
              messageId: 'default',
              data: { callee: node.callee.name },
              node: node.callee,
            });
          }
        }
      },
    };
  },
});

export const lowercaseFunction = createRule({
  name: 'lowercase-function',
  meta: {
    docs: {
      description: 'Function name should start with lowercase letter',
    },
    messages: {
      lowercase: 'Start naming with a lowercase letter',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id != null && node.id.type === 'Identifier') {
          if (/^[A-Z]/.test(node.id.name)) {
            context.report({
              messageId: 'lowercase',
              node: node.id,
              fix(fixer) {
                return fixer.replaceText(
                  node.id,
                  node.id.name.charAt(0).toLowerCase() + node.id.name.slice(1)
                );
              },
            });
          }
        }
      },
    };
  },
});
