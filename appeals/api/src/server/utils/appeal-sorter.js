import { add } from 'date-fns';
import {
	STATE_TARGET_FINAL_COMMENT_REVIEW,
	STATE_TARGET_STATEMENT_REVIEW,
	STATE_TARGET_ARRANGE_SITE_VISIT,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
	STATE_TARGET_READY_TO_START,
	CONFIG_APPEAL_TIMETABLE
} from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */

/**
 *
 * @param {AppealListResponse[]} appeals
 */
export const sortAppeals = (appeals) => {
	const appealDates = appeals.map((appeal) => {
		switch (appeal.appealStatus) {
			case STATE_TARGET_READY_TO_START:
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.HAS.lpaQuestionnaireDueDate.daysFromStartDate
					})
				};
			case STATE_TARGET_LPA_QUESTIONNAIRE_DUE:
				if (appeal.appealTimetable?.lpaQuestionnaireDueDate) {
					return {
						appealId: appeal.appealId,
						dueDate: new Date(appeal.appealTimetable?.lpaQuestionnaireDueDate)
					};
				}
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.FPA.statementReviewDate.daysFromStartDate
					})
				};
			case STATE_TARGET_ARRANGE_SITE_VISIT:
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.HAS.lpaQuestionnaireDueDate.daysFromStartDate
					})
				};
			case STATE_TARGET_ISSUE_DETERMINATION: {
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.HAS.lpaQuestionnaireDueDate.daysFromStartDate
					})
				};
			}
			case STATE_TARGET_STATEMENT_REVIEW: {
				if (appeal.appealTimetable?.statementReviewDate) {
					return {
						appealId: appeal.appealId,
						dueDate: new Date(appeal.appealTimetable?.statementReviewDate)
					};
				}
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.FPA.statementReviewDate.daysFromStartDate
					})
				};
			}
			case STATE_TARGET_FINAL_COMMENT_REVIEW: {
				if (appeal.appealTimetable?.finalCommentReviewDate) {
					return {
						appealId: appeal.appealId,
						dueDate: new Date(appeal.appealTimetable?.finalCommentReviewDate)
					};
				}
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: CONFIG_APPEAL_TIMETABLE.FPA.finalCommentReviewDate.daysFromStartDate
					})
				};
			}
		}
	});

	// @ts-ignore
	appealDates.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
	return appealDates.map((a) => appeals.find((_) => _.appealId === a?.appealId));

	// appeals.sort((a, b) => {

	// 	if (a.appealTimetable && b.appealTimetable) {
	// 		switch (a.appealStatus) {
	// 			case STATE_TARGET_READY_TO_START:
	// 				return 1;
	// 			case STATE_TARGET_LPA_QUESTIONNAIRE_DUE:
	// 			case STATE_TARGET_ARRANGE_SITE_VISIT:
	// 			case STATE_TARGET_ISSUE_DETERMINATION:
	// 				if (a.appealTimetable?.lpaQuestionnaireDueDate) {
	// 					return b.appealTimetable?.lpaQuestionnaireDueDate ?
	// 						new Date(a.appealTimetable?.lpaQuestionnaireDueDate).getTime() - new Date(b.appealTimetable?.lpaQuestionnaireDueDate).getTime() :
	// 						-1
	// 				}
	// 				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

	// 		}

	// 		// const dateCompareA = a.appealStatus != 'lpa_questionnaire_due' ?
	// 		// 	[a.appealTimetable?.finalCommentReviewDate, a.appealTimetable?.statementReviewDate].sort()[0] :
	// 		// 	a.appealTimetable?.lpaQuestionnaireDueDate;

	// 		// const dateCompareB = b.appealStatus != 'lpa_questionnaire_due' ?
	// 		// 	[b.appealTimetable?.finalCommentReviewDate, b.appealTimetable?.statementReviewDate].sort()[0] :
	// 		// 	b.appealTimetable?.lpaQuestionnaireDueDate;

	// 		//const datesA = [a.appealTimetable?.finalCommentReviewDate, a.appealTimetable?.statementReviewDate, a.appealTimetable?.lpaQuestionnaireDueDate].sort();
	// 		//const datesB = [b.appealTimetable?.finalCommentReviewDate, b.appealTimetable?.statementReviewDate, b.appealTimetable?.lpaQuestionnaireDueDate].sort();

	// 		// if (dateCompareA && dateCompareB) {
	// 		// 	return new Date(dateCompareB).getTime() - new Date(dateCompareA).getTime();
	// 		// }
	// 	}

	// 	return 1;
	// });
};
