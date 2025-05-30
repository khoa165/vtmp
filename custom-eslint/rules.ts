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

export const lowercaseFunction = createRule<[], 'lowercase'>({
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
    // Track renamed functions: old name -> new name
    const renamedFunctions = new Map<string, string>();

    return {
      VariableDeclarator(node) {
        if (
          node.id != null &&
          node.id.type === 'Identifier' &&
          node.init &&
          (node.init.type === 'FunctionExpression' ||
            node.init.type === 'ArrowFunctionExpression')
        ) {
          const identifier = node.id;
          if (/^[A-Z]/.test(identifier.name)) {
            const newName =
              identifier.name.charAt(0).toLowerCase() +
              identifier.name.slice(1);
            renamedFunctions.set(identifier.name, newName);

            context.report({
              messageId: 'lowercase',
              node: identifier,
              fix(fixer) {
                return fixer.replaceText(identifier, newName);
              },
            });
          }
        }
      },
      // Add a new visitor for all identifiers
      Identifier(node) {
        // Skip if this is the declaration we already handled
        if (
          node.parent?.type === 'VariableDeclarator' &&
          node === node.parent.id
        ) {
          return;
        }

        // Check if this identifier matches any renamed function
        const newName = renamedFunctions.get(node.name);
        if (newName) {
          context.report({
            messageId: 'lowercase',
            node: node,
            fix(fixer) {
              return fixer.replaceText(node, newName);
            },
          });
        }
      },
    };
  },
});
