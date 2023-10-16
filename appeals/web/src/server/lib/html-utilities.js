/**
 *
 * @param {string[]} stringArray
 * @returns {string}
 */
export function stringArrayToUnorderedList(stringArray) {
	return `<ul class="govuk-!-margin-top-0 govuk-!-padding-left-4">
		${stringArray.map((stringItem) => `<li>${stringItem}</li>`).join('')}
	</ul>`;
}
