import { webDateToDisplayDate } from '#lib/dates.js';

/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @param {import('../lpa-questionnaire.mapper.js').DayMonthYear} lpaQuestionnaireUpdatedDueDate
 * @returns {ConfirmationPageContent}
 */
export function decisionIncompleteConfirmationPage(
	appealId,
	appealReference,
	lpaQuestionnaireUpdatedDueDate
) {
	/** @type {PageBodyRow[]} */
	const rows = [
		{
			text: 'We’ve sent an email to the appellant and LPA to confirm their questionnaire is incomplete, and let them know what to do to complete it.'
		}
	];

	if (lpaQuestionnaireUpdatedDueDate) {
		rows.push({
			text: `We also let them know the due date has changed to the ${webDateToDisplayDate(
				lpaQuestionnaireUpdatedDueDate
			)}.`
		});
	}

	rows.push({
		text: 'Go to case details',
		href: `/appeals-service/appeal-details/${appealId}`
	});

	return {
		pageTitle: 'LPA questionnaire incomplete',
		panel: {
			title: 'LPA questionnaire incomplete',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preHeading: 'The review of LPA questionnaire is finished.',
			title: {
				text: 'What happens next'
			},
			rows
		}
	};
}
