import { addWeeksToDate } from '../../utils/add-weeks-to-date.js';
import formatAddress from '../../utils/address-formatter.js';
import { arrayOfStatusesContainsString } from '../../utils/array-of-statuses-contains-string.js';
import formatDate from '../../utils/date-formatter.js';
import { getAppealStatusCreatedAt } from '../../utils/get-appeal-status-created-at.js';
import formatReviewQuestionnaire from '../../utils/review-questionnaire-formatter.js';
import { weeksReceivingDocuments } from '../state-machine/full-planning-appeal.machine.js';
import { appealStates } from '../state-machine/transition-state.js';

const add2Weeks = (date) => {
	const newDate = new Date(date.valueOf());

	newDate.setDate(newDate.getDate() + 14);
	return newDate;
};

/**
 * @param {object} appealStatuses
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(appealStatuses) {
	if (arrayOfStatusesContainsString(appealStatuses, [appealStates.awaiting_lpa_questionnaire])) return 'awaiting';
	if (arrayOfStatusesContainsString(appealStatuses, [appealStates.overdue_lpa_questionnaire])) return 'overdue';
	if (arrayOfStatusesContainsString(appealStatuses, [appealStates.received_lpa_questionnaire])) return 'received';
	if (arrayOfStatusesContainsString(appealStatuses, [appealStates.incomplete_lpa_questionnaire])) return 'incomplete_lpa_questionnaire';
	return '';
}

/**
 * @param {object} appealStatusesParallel
 * @returns {string} reformatted appeal status
 */
function mapAppealParallelStatuses(appealStatusesParallel) {
	if (
		arrayOfStatusesContainsString(appealStatusesParallel, [appealStates.available_for_statements])
	) return 'available_for_statements';
	if (
		arrayOfStatusesContainsString(appealStatusesParallel, [
			appealStates.available_for_final_comments
		])
	) return 'available_for_final_comments';
	return '';
}

const appealFormatter = {
	/**
	 * @param {{ appealStatus: object; id: any; reference: any; address: object; startedAt: any; }} appeal
	 * @returns {object}
	 */
	formatAppealForAllAppeals(appeal) {
		const appealStatus = mapAppealStatus(appeal.appealStatus);

		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			QuestionnaireStatus: appealStatus,
			AppealSite: formatAddress(appeal.address),
			QuestionnaireDueDate: appeal.startedAt ? formatDate(add2Weeks(appeal.startedAt)) : ''
		};
	},
	/**
	 * @param {{ appealStatus: object; id: any; reference: any; address: object; startedAt: any; }} appeal
	 * @returns {{AppealId: number; AppealReference: string; StatementsAndFinalCommentsStatus: string; AppealSite: object; QuestionnaireDueDate: any}}
	 */
	formatAppealForParallelStates(appeal) {
		const appealStatusParallel = mapAppealParallelStatuses(appeal.appealStatus);

		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			StatementsAndFinalCommentsStatus: appealStatusParallel,
			AppealSite: formatAddress(appeal.address),
			QuestionnaireDueDate: appeal.startedAt ? formatDate(add2Weeks(appeal.startedAt)) : ''
		};
	},
	/**
	 * @param {{ id: any; reference: any; appealStatus: any; }} appeal
	 *  @returns {object}
	 */
	formatAppealForAfterStatementUpload(appeal) {
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			canUploadStatementsUntil: formatDate(
				addWeeksToDate(
					getAppealStatusCreatedAt(appeal.appealStatus, appealStates.available_for_statements),
					weeksReceivingDocuments.statements
				),
				false
			)
		};
	},
	/**
	 * @param {{ id: any; reference: any; appealStatus: any; }} appeal
	 *  @returns {object}
	 */
	formatAppealAfterFinalCommentUpload(appeal) {
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			canUploadFinalCommentsUntil: formatDate(
				addWeeksToDate(
					getAppealStatusCreatedAt(appeal.appealStatus, appealStates.available_for_final_comments),
					weeksReceivingDocuments.finalComments
				),
				false
			)
		};
	},
	/**
	 * @param {{ id: any; reference: any; localPlanningDepartment: any; planningApplicationReference: any; address: object; lpaQuestionnaire: { listedBuildingDescription: any; }; reviewQuestionnaire: import("../utils/review-questionnaire-formatter.js").ReviewQuestionnare[]; }} appeal
	 * @returns {object}
	 */
	formatAppealForAppealDetails(appeal) {
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			LocalPlanningDepartment: appeal.localPlanningDepartment,
			PlanningApplicationreference: appeal.planningApplicationReference,
			AppealSite: formatAddress(appeal.address),
			AppealSiteNearConservationArea: false,
			WouldDevelopmentAffectSettingOfListedBuilding: false,
			...(appeal.lpaQuestionnaire && {
				ListedBuildingDesc: appeal.lpaQuestionnaire.listedBuildingDescription || ''
			}),
			...(appeal.reviewQuestionnaire &&
				appeal.reviewQuestionnaire[0] && {
					reviewQuestionnaire: formatReviewQuestionnaire(appeal.reviewQuestionnaire[0])
				}),
			Documents: [
				{
					Type: 'planning application form',
					Filename: 'planning-application.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'decision letter',
					Filename: 'decision-letter.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'appeal statement',
					Filename: 'appeal-statement.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-3.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'planning officers report',
					Filename: 'planning-officers-report.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'plans used to reach decision',
					Filename: 'plans-used-to-reach-decision.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'statutory development plan policy',
					Filename: 'policy-and-supporting-text-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'statutory development plan policy',
					Filename: 'policy-and-supporting-text-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'statutory development plan policy',
					Filename: 'policy-and-supporting-text-3.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'other relevant policy',
					Filename: 'policy-and-supporting-text-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'other relevant policy',
					Filename: 'policy-and-supporting-text-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'other relevant policy',
					Filename: 'policy-and-supporting-text-3.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'conservation area guidance',
					Filename: 'conservation-area-plan.pdf',
					URL: 'localhost:8080'
				}
			]
		};
	}
};

export default appealFormatter;
