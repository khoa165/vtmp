import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

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
