import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

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
