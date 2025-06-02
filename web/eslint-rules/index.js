module.exports = {
  rules: {
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
                  const varName = node.parent.id.name;
                  const declaration = node.parent.parent;
                  return fixer.replaceText(
                    declaration,
                    `import ${varName} from '${moduleName}';`
                  );
                },
              });
            }
          },
        };
      },
    },
  },
};
