/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: 'problem',
		schema: [],
		messages: {
			should: `Spec descriptions should start with 'should'`
		}
	},
	create(context) {
		return {
			CallExpression(node) {
				if (
					node.callee.name === 'it' &&
					node.arguments[0].raw &&
					!node.arguments[0].raw.startsWith(`'should`)
				) {
					context.report({
						messageId: 'should',
						node
					});
				}
			}
		};
	}
};
