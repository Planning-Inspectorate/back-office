import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @returns {PageContent}
 */
export function decisionValidConfirmationPage(appealId, appealReference) {
	/** @type {PageContent} */
	const pageContent = {
		title: 'Appeal valid',
		pageComponents: [
			{
				type: 'panel',
				parameters: {
					titleText: 'Appeal valid',
					headingLevel: 1,
					html: `Appeal reference<br><strong>${appealShortReference(appealReference)}</strong>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<span class="govuk-body">The timetable is now created and published.</span>`
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
					html: `<p class="govuk-body">We've sent the start letter email to the Appellant and LPA.</p>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body">The case has been published on the Appeals Casework Portal.</p>`
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
