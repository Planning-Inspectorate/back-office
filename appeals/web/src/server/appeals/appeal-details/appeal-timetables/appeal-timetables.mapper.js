import { dateToDisplayDate } from '#lib/dates.js';
import { capitalize } from 'lodash-es';
import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 */

/**
 * @typedef {Object} AppealTimetablesMap
 * @property {string | null | undefined} sideNote
 * @property { object } page
 * @property { AppealTimetablesConfirmation } confirmation
 */

/**
 * @typedef {Object} AppealTimetablesConfirmation
 * @property { string } title
 * @property { string } preHeading
 * @property { object[] } rows
 */

/**
 * @typedef {'finalCommentReviewDate' | 'issueDeterminationDate' | 'lpaQuestionnaireDueDate' | 'statementReviewDate'} AppealTimetableType
 */

/**
 * @type {Object.<'final-comment-review' | 'issue-determination' | 'lpa-questionnaire' | 'statement-review', 'finalCommentReviewDate' | 'issueDeterminationDate' | 'lpaQuestionnaireDueDate' | 'statementReviewDate'>}
 */
export const routeToObjectMapper = {
	'final-comment-review': 'finalCommentReviewDate',
	'issue-determination': 'issueDeterminationDate',
	'lpa-questionnaire': 'lpaQuestionnaireDueDate',
	'statement-review': 'statementReviewDate'
};

/**
 * @param {import('./appeal-timetables.service.js').AppealTimetables} appealTimetables
 * @param {AppealTimetableType} timetableType
 * @param {Appeal} appealDetails
 * @returns {PageContent}
 */
export const mapUpdateDueDatePage = (appealTimetables, timetableType, appealDetails) => {
	const currentDueDateIso = appealTimetables && appealTimetables[timetableType];
	const currentDueDate = currentDueDateIso && dateToDisplayDate(currentDueDateIso);
	const changeOrScheduleText = currentDueDate ? 'Change' : 'Schedule';
	const timetableTypeText = getTimetableTypeText(timetableType);

	/** @type {PageContent} */
	const pageContent = {
		title: `Update${timetableTypeText ? ' ' + capitalize(timetableTypeText) : ''} due date`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${appealShortReference(appealDetails.appealReference)}`,
		heading: `${changeOrScheduleText} ${timetableTypeText} due date`,
		submitButtonProperties: {
			text: 'Continue',
			type: 'submit'
		},
		pageComponents: []
	};

	if (currentDueDate) {
		pageContent.pageComponents?.push({
			type: 'inset-text',
			parameters: {
				text: `The current due date for the ${timetableTypeText} is ${currentDueDate}`,
				classes: 'govuk-!-margin-bottom-7'
			}
		});
	}

	return pageContent;
};

/**
 * @param {import('./appeal-timetables.service.js').AppealTimetables} appealTimetables
 * @param {AppealTimetableType} timetableType
 * @param {Appeal} appealDetails
 * @returns {PageContent}
 */
export const mapConfirmationPage = (appealTimetables, timetableType, appealDetails) => {
	const timetableTypeText = getTimetableTypeText(timetableType);
	const titleText =
		timetableType === 'lpaQuestionnaireDueDate' ? timetableTypeText : capitalize(timetableTypeText);

	/** @type {PageContent} */
	const pageContent = {
		title: `${titleText} due date changed`,
		pageComponents: [
			{
				type: 'panel',
				parameters: {
					titleText: `${titleText} due date changed`,
					headingLevel: 1,
					html: `Appeal reference<br><strong>${appealShortReference(
						appealDetails.appealReference
					)}</strong>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<span class="govuk-body">New due date: ${dateToDisplayDate(
						appealTimetables.lpaQuestionnaireDueDate
					)}</span>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: '<h2>What happens next</h2>'
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body">The appellant${
						timetableType === 'lpaQuestionnaireDueDate' ? ' and LPA have' : 'has'
					} been informed.</p>`
				}
			},
			{
				type: 'html',
				parameters: {
					html: `<p class="govuk-body"><a class="govuk-link" href="/appeals-service/appeal-details/${appealDetails.appealId}">Go back to case details</a></p>`
				}
			}
		]
	};

	return pageContent;
};

/**
 * @param { number } updatedDueDateDay
 * @param { string } apiError
 * @returns { object }
 */
export const apiErrorMapper = (updatedDueDateDay, apiError) => ({
	'due-date-day': {
		value: String(updatedDueDateDay),
		msg: `Date ${apiError}`,
		param: '',
		location: 'body'
	}
});

/**
 * @param {AppealTimetableType} timetableType
 * @returns {string}
 */
const getTimetableTypeText = (timetableType) => {
	switch (timetableType) {
		case 'finalCommentReviewDate':
			return 'final comment review';
		case 'issueDeterminationDate':
			return 'issue determination';
		case 'lpaQuestionnaireDueDate':
			return 'LPA questionnaire';
		case 'statementReviewDate':
			return 'statement review';
		default:
			return '';
	}
};
