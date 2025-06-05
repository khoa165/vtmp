import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

//Add Nam
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const noRequireFunctionCalls = createRule({
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
