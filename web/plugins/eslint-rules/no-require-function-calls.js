export const rules = {
  'no-require-function-calls': {
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
                const moduleName = node.arguments[0].value;
                const declaration = node.parent.parent;

                if (node.parent.id.type === 'ObjectPattern') {
                  const valueKey = node.parent.id.properties.map(
                    (p) => p.value.name
                  );

                  return fixer.replaceText(
                    declaration,
                    `import { ${valueKey.join(', ')} } from 'fs';`
                  );
                } else {
                  const varName = node.parent.id.name;
                  return fixer.replaceText(
                    declaration,
                    `import ${varName} from '${moduleName}';`
                  );
                }
              },
            });
          }
        },
      };
    },
  },
};
