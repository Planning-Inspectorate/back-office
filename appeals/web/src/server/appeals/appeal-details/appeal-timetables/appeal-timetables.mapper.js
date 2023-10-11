import { dateToDisplayDate } from '#lib/dates.js';

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
 * @returns {AppealTimetablesMap | undefined}
 */
export const appealTimetablesMapper = (appealTimetables, timetableProperty) => {
	const currentDueDateIso = appealTimetables && appealTimetables[timetableProperty];
	const currentDueDate = currentDueDateIso && dateToDisplayDate(currentDueDateIso);
	const changeOrScheduleText = currentDueDate ? 'Change' : 'Schedule';

	if (timetableProperty === 'finalCommentReviewDate') {
		return {
			sideNote:
				currentDueDate && `The current due date for the final comment review is ${currentDueDate}`,
			page: {
				title: 'Final comment review due date',
				text: `${changeOrScheduleText} final comment review due date`
			},
			confirmation: {
				title: 'Final comment review due date updated',
				preTitle: 'The due date for the final comment review due date has been updated.',
				rows: [
					{
						text: 'We’ve sent an email to the appellant to inform them about changes to the timetable.'
					}
				]
			}
		};
	} else if (timetableProperty === 'issueDeterminationDate') {
		return {
			sideNote:
				currentDueDate && `The current due date for the issue determination is ${currentDueDate}`,
			page: {
				title: 'Issue determination due date',
				text: `${changeOrScheduleText} issue determination due date`
			},
			confirmation: {
				title: 'Issue determination due date updated',
				preTitle: 'The due date for the issue determination has been updated.',
				rows: [
					{
						text: 'We’ve sent an email to the appellant to inform them about changes to the timetable.'
					}
				]
			}
		};
	} else if (timetableProperty === 'lpaQuestionnaireDueDate') {
		return {
			sideNote:
				currentDueDate && `The current due date for the LPA questionnaire is ${currentDueDate}`,
			page: {
				title: 'LPA questionnaire due date',
				text: `${changeOrScheduleText} LPA questionnaire due date`
			},
			confirmation: {
				title: 'LPA Questionnaire due date updated',
				preTitle: 'The due date for the LPA Questionnaire has been updated.',
				rows: [
					{
						text: 'We’ve sent an email to the appellant and LPA to inform them about changes to the timetable.'
					},
					{
						text: 'We also sent them a reminder about the appeal’s due date.'
					}
				]
			}
		};
	} else if (timetableProperty === 'statementReviewDate') {
		return {
			sideNote:
				currentDueDate && `The current due date for the statement review is ${currentDueDate}`,
			page: {
				title: 'Statement review due date',
				text: `${changeOrScheduleText} statement review due date`
			},
			confirmation: {
				title: 'Statement review due date updated',
				preTitle: 'The due date for the statement review has been updated.',
				rows: [
					{
						text: 'We’ve sent an email to the appellant to inform them about changes to the timetable.'
					}
				]
			}
		};
	}
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
