import { add } from 'date-fns';
import {
	STATE_TARGET_FINAL_COMMENT_REVIEW,
	STATE_TARGET_STATEMENT_REVIEW,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
	STATE_TARGET_READY_TO_START,
	STATE_TARGET_ASSIGN_CASE_OFFICER
} from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealListResponse} AppealListResponse */

const approxStageCompletion = {
	STATE_TARGET_READY_TO_START: 5,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE: 10,
	STATE_TARGET_ASSIGN_CASE_OFFICER: 15,
	STATE_TARGET_ISSUE_DETERMINATION: 30,
	STATE_TARGET_STATEMENT_REVIEW: 55,
	STATE_TARGET_FINAL_COMMENT_REVIEW: 60
};

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
						days: approxStageCompletion.STATE_TARGET_READY_TO_START
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
						days: approxStageCompletion.STATE_TARGET_LPA_QUESTIONNAIRE_DUE
					})
				};
			case STATE_TARGET_ASSIGN_CASE_OFFICER:
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: approxStageCompletion.STATE_TARGET_ASSIGN_CASE_OFFICER
					})
				};
			case STATE_TARGET_ISSUE_DETERMINATION: {
				if (appeal.appealTimetable?.issueDeterminationDate) {
					return {
						appealId: appeal.appealId,
						dueDate: new Date(appeal.appealTimetable?.issueDeterminationDate)
					};
				}
				return {
					appealId: appeal.appealId,
					dueDate: add(new Date(appeal.createdAt), {
						days: approxStageCompletion.STATE_TARGET_ISSUE_DETERMINATION
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
						days: approxStageCompletion.STATE_TARGET_STATEMENT_REVIEW
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
						days: approxStageCompletion.STATE_TARGET_FINAL_COMMENT_REVIEW
					})
				};
			}
		}
	});

	// @ts-ignore
	appealDates.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

	return appealDates.map((appealDate) => {
		const matchingAppeal = appeals.find((appeal) => appeal.appealId === appealDate?.appealId);
		return {
			...matchingAppeal,
			dueDate: appealDate?.dueDate
		};
	});
};
