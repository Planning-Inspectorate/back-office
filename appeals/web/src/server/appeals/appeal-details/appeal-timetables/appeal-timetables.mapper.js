import { dateToDisplayDate } from '#lib/dates.js';
import { capitalize } from 'lodash-es';
import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 * @typedef AppealTimetablesMap
 * @type {object}
 * @property {string | null | undefined} sideNote
 * @property { object } page
 * @property { AppealTimetablesConfirmation } confirmation
 */

/**
 * @typedef AppealTimetablesConfirmation
 * @type {object}
 * @property { string } title
 * @property { string } preTitle
 * @property { object[] } rows
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
 * @param { 'finalCommentReviewDate' | 'issueDeterminationDate' | 'lpaQuestionnaireDueDate' | 'statementReviewDate' } timetableProperty
 * @param {import('../appeal-details.types').Appeal} appealDetails
 * @returns {{pageContent: PageContent, pageComponents: PageComponent[]}}
 */
export const appealTimetablesMapper = (appealTimetables, timetableProperty, appealDetails) => {
	const currentDueDateIso = appealTimetables && appealTimetables[timetableProperty];
	const currentDueDate = currentDueDateIso && dateToDisplayDate(currentDueDateIso);
	const changeOrScheduleText = currentDueDate ? 'Change' : 'Schedule';

	/** @type {{pageContent: PageContent, pageComponents: PageComponent[]}} */
	const pageData = {
		pageContent: {
			title: 'Update due date',
			backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
			preHeading: `Appeal ${appealShortReference(appealDetails.appealReference)}`,
			heading: 'Update due date',
			continueButtonText: 'Continue'
		},
		pageComponents: []
	};

	let timetablePropertyText;

	switch (timetableProperty) {
		case 'finalCommentReviewDate':
			timetablePropertyText = 'final comment review';
			break;
		case 'issueDeterminationDate':
			timetablePropertyText = 'issue determination';
			break;
		case 'lpaQuestionnaireDueDate':
			timetablePropertyText = 'LPA questionnaire';
			break;
		case 'statementReviewDate':
			timetablePropertyText = 'statement review';
			break;
		default:
			break;
	}

	pageData.pageContent.title = `Update${timetablePropertyText ? ' ' + capitalize(timetablePropertyText) : ''} due date`;
	pageData.pageContent.heading = `${changeOrScheduleText} ${timetablePropertyText} due date`;

	if (currentDueDate) {
		pageData.pageComponents.push({
			type: 'inset-text',
			parameters: {
				text: `The current due date for the ${timetablePropertyText} is ${currentDueDate}`,
				classes: ''
			}
		});
	}

	return pageData;
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
