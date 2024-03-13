/* eslint-env jest */

/**
 * Asserts that the html snapshot does not contain an error message and matches the snapshot
 * @param {string} htmlOutput
 * @param {string} errorMessage
 */
export function toMatchSnapshotWithoutError(
	htmlOutput,
	errorMessage = '<h2 class="govuk-error-summary__title"> There is a problem</h2>'
) {
	expect(htmlOutput).not.toContain(errorMessage);
	expect(htmlOutput).toMatchSnapshot();
}
