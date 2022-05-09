/**
 * @file
 * Configuration for the 'unicorn' plugin.
 */

module.exports = {
	extends: ['plugin:unicorn/recommended'],
	plugins: ['unicorn'],
  rules: {
    // disallow the use of the null literal
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
    'unicorn/no-null': 'off'
  }
};
