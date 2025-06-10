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
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require'
        ) {
          context.report({
            node,
            messageId: 'noRequire',
            fix(fixer) {
              const moduleNameLiteral = node.arguments[0];

              if (
                moduleNameLiteral.type !== 'Literal' ||
                typeof moduleNameLiteral.value !== 'string'
              ) {
                return null;
              }

              const moduleName = moduleNameLiteral.value;
              const declaration = node.parent?.parent;
              const parentNode = node.parent;

              if (
                parentNode?.type === 'VariableDeclarator' &&
                declaration?.type === 'VariableDeclaration'
              ) {
                if (parentNode.id.type === 'ObjectPattern') {
                  const valueKey = parentNode.id.properties.map((p) => {
                    if (
                      p.type === 'Property' &&
                      p.value.type === 'Identifier'
                    ) {
                      return p.value.name;
                    }
                    return '';
                  });

                  return fixer.replaceText(
                    declaration,
                    `import { ${valueKey.join(', ')} } from '${moduleName}';`
                  );
                }

                if (parentNode.id.type === 'Identifier') {
                  const varName = parentNode.id.name;
                  return fixer.replaceText(
                    declaration,
                    `import ${varName} from '${moduleName}';`
                  );
                }
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
      TSEnumMember(node) {
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

export const enforceSortedEnumKeys = createRule<[], 'unsorted'>({
  name: 'enforce-sorted-enum-keys',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enum keys must be sorted alphabetically (key === value)',
    },
    fixable: 'code',
    messages: {
      unsorted: 'Enum keys must be sorted alphabetically',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumDeclaration(node) {
        const members = node.body?.members;
        const getKey = (m: TSESTree.TSEnumMember) => {
          const id = m?.id;
          if (id?.type === 'Identifier') return id.name;
          if (id?.type === 'Literal' && typeof id.value === 'string')
            return id.value;
          return '';
        };

        const sorted = [...members].sort((a, b) =>
          getKey(a).localeCompare(getKey(b))
        );

        for (let i = 0; i < members.length; i++) {
          if (members[i] !== sorted[i]) {
            context.report({
              node: members[i],
              messageId: 'unsorted',
              fix: (fixer) => {
                const sourceCode = context.sourceCode;
                const sortedText = sorted
                  .map((member) => sourceCode.getText(member))
                  .join(',\n');

                return fixer.replaceTextRange(
                  [members[0].range[0], members[members.length - 1].range[1]],
                  sortedText
                );
              },
            });
            break;
          }
        }
      },
    };
  },
});
