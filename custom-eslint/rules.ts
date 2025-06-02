import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

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

export const wrappedHandlersInRouter = createRule<[], 'wrapped'>({
  name: 'wrapped-handlers-in-router',
  meta: {
    docs: {
      description: 'Route handlers should be wrapped in wrappedHandlers',
    },
    messages: {
      wrapped: 'Route handlers must be wrapped in wrappedHandlers function',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          ['get', 'post', 'put', 'delete', 'patch', 'use'].includes(
            node.callee.property.name
          )
        ) {
          const startIndex = node.callee.property.name !== 'use' ? 1 : 0;
          const allHandlers: string[] = [];
          const needsFixingIdxs = [];

          for (let i = startIndex; i < node.arguments.length; i++) {
            const arg = node.arguments[i];
            if (
              arg.type === 'CallExpression' &&
              arg.callee.type === 'Identifier' &&
              arg.callee.name === 'wrappedHandlers'
            ) {
              const wrappedArg = arg.arguments[0];
              if (wrappedArg.type === 'ArrayExpression') {
                wrappedArg.elements.forEach((el) => {
                  if (el) allHandlers.push(context.sourceCode.getText(el));
                });
              }
              continue;
            }

            allHandlers.push(context.sourceCode.getText(arg));
            needsFixingIdxs.push(i);
          }
          if (needsFixingIdxs.length > 0) {
            needsFixingIdxs.forEach((idx) => {
              context.report({
                node: node.arguments[idx],
                messageId: 'wrapped',
                fix(fixer) {
                  const firstNode = node.arguments[startIndex];
                  const lastNode = node.arguments[node.arguments.length - 1];
                  return fixer.replaceTextRange(
                    [firstNode.range[0], lastNode.range[1]],
                    `wrappedHandlers([${allHandlers.join(', ')}])`
                  );
                },
              });
            });
          }
        }
      },
    };
  },
});
