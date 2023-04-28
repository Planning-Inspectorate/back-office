import formatAddress from '../../utils/address-block-formtter.js';

const appealFormatter = {
	/**
	 * @param {import('@pins/api').Schema.Appeal} appeal
	 * @returns {{
	 * 	 appealId: number,
	 * 	 appealReference: string,
	 * 	 appealSite: { addressLine1?: string, addressLine2?: string, town?: string, county?: string, postCode?: string | null },
	 * 	 appealStatus: string
	 * 	 appealType: string,
	 * 	 createdAt: Date,
	 * 	 localPlanningDepartment: string,
	 * }}}
	 */
	formatAppeals: (appeal) => ({
		appealId: appeal.id,
		appealReference: appeal.reference,
		appealSite: formatAddress(appeal.address),
		appealStatus: appeal.appealStatus[0].status,
		appealType: appeal.appealType.type,
		createdAt: appeal.createdAt,
		localPlanningDepartment: appeal.localPlanningDepartment
	}),
	/**
	 * @param {import('@pins/api').Schema.Appeal} appeal
	 * @returns {{
	 *   agentName?: string | null,
	 *   allocationDetails: string,
	 *   appealId: number,
	 *   appealReference: string,
	 *   appealSite: { addressLine1?: string, addressLine2?: string, town?: string, county?: string, postCode?: string | null },
	 *   appealStatus: string
	 *   appealType: string,
	 *   appellantName?: string,
	 *   caseProcedure: string,
	 *   decision?: string,
	 *   developmentType: string,
	 *   eventType: string,
	 *   linkedAppeal: { appealId: number | null, appealReference: string | null }
	 *   localPlanningDepartment: string,
	 *   otherAppeals: [{ appealId: number | null, appealReference: string | null }]
	 *   planningApplicationReference: string,
	 *   visitType?: string,
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
			appealType: appeal.appealType.type,
			appellantName: appeal.appellant?.name,
			caseProcedure: 'Written',
			decision: appeal.inspectorDecision?.outcome,
			developmentType: 'Minor Dwellings',
			eventType: 'Site Visit',
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
			visitType: appeal.siteVisit?.visitType
		};
	}
};

export default appealFormatter;
