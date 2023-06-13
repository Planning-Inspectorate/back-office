const { isRegExp } = require('lodash');

const scopes = [
	'api',
	'api/appeals',
	'api/applications',
	'api-testing',
	'web',
	'web/appeals',
	'web/applications',
	'functions',
	/functions\/(.*)/,
	'e2e',
	'express',
	'platform',
	'storage',
	'tooling'
];

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-enums': [
			2,
			'always',
			{
				build: [null, 'deps'], // allow dependabot commits
				chore: scopes,
				ci: [],
				docs: [null, ...scopes],
				feat: scopes,
				fix: scopes,
				perf: scopes,
				refactor: scopes,
				revert: [],
				style: scopes,
				test: [null, ...scopes]
			}
		]
	},
	plugins: [
		{
			rules: {
				'scope-enums': (
					{ type, scope },
					condition,
					/** @type {Record<string, (string | null)[]>} */ rule
				) => {
					if (!type) {
						return [false, 'the scope could not be determined'];
					}
					if (condition === 'never') {
						return [false, 'the "scope-enums" rule does not support "never"'];
					}

					const allowedScopes = rule[type];

					// If the `type` does not appear in the rule config, allow any scope or no scope
					if (!allowedScopes) {
						return [true];
					}

					// If the `type` belongs to to an empty array in the rule config, any
					// provided scope will be considered as not allowed
					if (allowedScopes.length === 0) {
						return scope === null
							? [true]
							: [false, `commit messages with type "${type}" must not specify a scope`];
					}

					// Otherwise attempt to match against either null, a string literal,
					// or a regular expression
					if (
						allowedScopes.some((allowedScope) => {
							if (isRegExp(allowedScope)) {
								if (scope == null) {
									return false;
								}
								return allowedScope.exec(scope) !== null;
							} else {
								return allowedScope === scope;
							}
						})
					) {
						return [true];
					}

					// If the allowed scopes contained null – i.e. a scope is optional,
					// but the provided scope was not valid, fail on the basis that an
					// allowed scope was not used
					if (allowedScopes.includes(null)) {
						return [
							false,
							`commit message with type "${type}" may specify a scope, but if specified, it must be one of the following: ${allowedScopes
								.filter((s) => s !== null)
								.map((s) => `"${s}"`)
								.join(', ')}`
						];
					}

					return [
						false,
						`commit message with type "${type}" must specify one of the following scopes: ${allowedScopes
							.map((s) => `"${s}"`)
							.join(', ')}`
					];
				}
			}
		}
	]
};
