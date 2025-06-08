import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const noRequireFunctionCalls = createRule<[], 'noRequire'>({
  name: 'no-require-function-calls',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow require() usage in favor of ES module imports',
    },
    schema: [],
    messages: {
      noRequire: 'Avoid using require(); use ES module import instead.',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require'
        ) {
          context.report({
            node,
            messageId: 'noRequire',
            fix(fixer) {
              const moduleName = (node.arguments[0] as TSESTree.Literal).value;

              const declaration = node.parent?.parent;
              const parentNode = node.parent as TSESTree.VariableDeclarator;

              if (
                parentNode.id.type === 'ObjectPattern' &&
                declaration?.type === 'VariableDeclaration'
              ) {
                const valueKey = parentNode.id.properties.map((p) => {
                  const value = (p as TSESTree.Property).value;
                  if (value.type === 'Identifier') {
                    return value.name;
                  }
                  return '';
                });

                return fixer.replaceText(
                  declaration,
                  `import { ${valueKey.join(', ')} } from '${moduleName}';`
                );
              } else if (
                parentNode.id.type === 'Identifier' &&
                declaration?.type === 'VariableDeclaration'
              ) {
                const varName = parentNode.id.name;
                return fixer.replaceText(
                  declaration,
                  `import ${varName} from '${moduleName}';`
                );
              }

              return null;
            },
          });
        }
      },
    };
  },
});

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
      TryStatement(node: TSESTree.TryStatement) {
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
export const enforceUppercaseEnumValues = createRule<
  [],
  'notUppercaseOrMismatch'
>({
  name: 'enforce-uppercase-enum-values',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure enum keys and values are identical and uppercase',
    },
    schema: [],
    messages: {
      notUppercaseOrMismatch:
        "Enum key '{{key}}' must match its value and be all uppercase.",
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumMember(node: TSESTree.TSEnumMember) {
        if (
          node.id.type === 'Identifier' &&
          node.initializer?.type === 'Literal' &&
          typeof node.initializer.value === 'string'
        ) {
          const key = node.id.name;
          const value = node.initializer.value;
          const upperKey = key.toUpperCase();

          const keyMismatch = key !== upperKey;
          const valueMismatch = value !== upperKey;

          if (keyMismatch || valueMismatch) {
            context.report({
              node,
              messageId: 'notUppercaseOrMismatch',
              data: { key },
              fix(fixer) {
                const fixes: ReturnType<typeof fixer.replaceText>[] = [];

                fixes.push(fixer.replaceText(node.id, upperKey));

                fixes.push(
                  fixer.replaceText(node.initializer!, `'${upperKey}'`)
                );

                return fixes;
              },
            });
          }
        }
      },
    };
  },
});
