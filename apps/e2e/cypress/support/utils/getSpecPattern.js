/**
 * Returns the file path for the specified application under test.
 *
 * @param {string} app - The name of the app for which to retrieve the file path. (options: `appeals` or `applications`)
 * @returns {string} The file path for the specified app.
 * @throws {Error} If the input is not a non-empty string.
 */
function getSpecPattern(app) {
	if (typeof app !== 'string' || app.length === 0) {
		throw new Error('Invalid input. App name must be a non-empty string.');
	}
	return `cypress/e2e/back-office-${app}/a/*.spec.js`;
}

module.exports = { getSpecPattern };
