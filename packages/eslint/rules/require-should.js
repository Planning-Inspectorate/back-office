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
					'name' in node.callee &&
					node.callee.name === 'it' &&
					'raw' in node.arguments[0] &&
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
