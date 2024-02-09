import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @returns {PageContent}
 */
export function decisionIncompleteConfirmationPage(appealId, appealReference) {
	/** @type {PageContent} */
	const pageContent = {
		title: 'Appeal incomplete',
		pageComponents: [
			{
				type: 'panel',
				parameters: {
					titleText: 'Appeal incomplete',
					headingLevel: 1,
					html: `Appeal reference<br><strong>${appealShortReference(appealReference)}</strong>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<span class="govuk-body">The appeal has been reviewed.</span>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<h2>What happens next</h2>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body">The appellant and LPA have been informed. We have told them what to do next.</p>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body">They have been advised of any new due date for missing information.</p>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body"><a class="govuk-link" href="/appeals-service/appeal-details/${appealId}">Go back to case details</a></p>`
				}
			}
		]
	};

	return pageContent;
}
