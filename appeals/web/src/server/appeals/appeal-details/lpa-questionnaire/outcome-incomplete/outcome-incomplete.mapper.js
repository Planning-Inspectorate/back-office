import { webDateToDisplayDate } from '#lib/dates.js';
import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @param {import('../lpa-questionnaire.mapper.js').DayMonthYear} lpaQuestionnaireUpdatedDueDate
 * @returns {PageContent}
 */
export function decisionIncompleteConfirmationPage(
	appealId,
	appealReference,
	lpaQuestionnaireUpdatedDueDate
) {
	/** @type {PageComponent[]} */
	const updatedDueDateComponents = [];

	if (lpaQuestionnaireUpdatedDueDate) {
		updatedDueDateComponents.push({
			type: 'html',
			parameters: {
				html: `<p class="govuk-body">We also let them know the due date has changed to the ${webDateToDisplayDate(
					lpaQuestionnaireUpdatedDueDate
				)}.</p>`
			}
		});
	}

	/** @type {PageContent} */
	const pageContent = {
		title: 'LPA questionnaire incomplete',
		pageComponents: [
			{
				type: 'panel',
				parameters: {
					titleText: 'LPA questionnaire incomplete',
					headingLevel: 1,
					html: `Appeal reference<br><strong>${appealShortReference(appealReference)}</strong>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<span class="govuk-body">The review of LPA questionnaire is finished.</span>`
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
					html: `<p class="govuk-body">We’ve sent an email to the appellant and LPA to confirm their questionnaire is incomplete, and let them know what to do to complete it.</p>`
				}
			},
			...updatedDueDateComponents,
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
