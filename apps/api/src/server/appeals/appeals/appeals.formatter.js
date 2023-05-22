import formatAddress from '../../utils/address-block-formtter.js';
import { APPEAL_TYPE_SHORTCODE_FPA } from '../constants.js';

const appealFormatter = {
	/**
	 * @param {import('@pins/api').Appeals.RepositoryGetAllResultItem} appeal
	 * @returns {{
	 * 	 appealId: number,
	 * 	 appealReference: string,
	 * 	 appealSite: import('@pins/api').Appeals.AppealSite,
	 * 	 appealStatus: string,
	 * 	 appealType?: string,
	 * 	 createdAt: Date,
	 * 	 localPlanningDepartment: string,
	 * }}}
	 */
	formatAppeals: (appeal) => ({
		appealId: appeal.id,
		appealReference: appeal.reference,
		appealSite: formatAddress(appeal.address),
		appealStatus: appeal.appealStatus[0].status,
		appealType: appeal.appealType?.type,
		createdAt: appeal.createdAt,
		localPlanningDepartment: appeal.localPlanningDepartment
	}),
	/**
	 * @param {import('@pins/api').Appeals.RepositoryGetByIdResultItem} appeal
	 * @returns {{
	 *   agentName?: string | null,
	 *   allocationDetails: string,
	 *   appealId: number,
	 *   appealReference: string,
	 *   appealSite: import('@pins/api').Appeals.AppealSite,
	 *   appealStatus: string,
	 * 	 appealTimetable: import('@pins/api').Appeals.AppealTimetable,
	 *   appealType?: string,
	 *   appellantName?: string,
	 *   caseProcedure: string,
	 *   decision?: string,
	 *   linkedAppeal: import('@pins/api').Appeals.LinkedAppeal,
	 *   localPlanningDepartment: string,
	 *   otherAppeals: [import('@pins/api').Appeals.LinkedAppeal],
	 *   planningApplicationReference: string,
	 * 	 siteVisit: { visitDate?: Date | null }
	 * 	 startedAt: Date | null,
	 * }}}
	 */
	formatAppeal(appeal) {
		return {
			agentName: appeal.appellant?.agentName,
			allocationDetails: 'F / General Allocation',
			appealId: appeal.id,
			appealReference: appeal.reference,
			appealSite: formatAddress(appeal.address),
			appealStatus: appeal.appealStatus[0].status,
			appealTimetable: {
				finalEventsDueDate: appeal.appealTimetable?.finalEventsDueDate || null,
				...(appeal.appealType?.shorthand === APPEAL_TYPE_SHORTCODE_FPA && {
					interestedPartyRepsDueDate: appeal.appealTimetable?.interestedPartyRepsDueDate || null
				}),
				questionnaireDueDate: appeal.appealTimetable?.questionnaireDueDate || null,
				...(appeal.appealType?.shorthand === APPEAL_TYPE_SHORTCODE_FPA && {
					statementDueDate: appeal.appealTimetable?.statementDueDate || null
				})
			},
			appealType: appeal.appealType?.type,
			appellantName: appeal.appellant?.name,
			caseProcedure: 'Written',
			decision: appeal.inspectorDecision?.outcome,
			linkedAppeal: {
				appealId: 1,
				appealReference: 'APP/Q9999/D/21/725284'
			},
			localPlanningDepartment: appeal.localPlanningDepartment,
			otherAppeals: [
				{
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				}
			],
			planningApplicationReference: appeal.planningApplicationReference,
			siteVisit: {
				visitDate: appeal.siteVisit?.visitDate || null
			},
			startedAt: appeal.startedAt
		};
	}
};

export default appealFormatter;
