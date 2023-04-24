import formatAddress from '../../utils/address-block-formtter.js';

const appealFormatter = {
	/**
	 * @param {import('@pins/api').Schema.Appeal} appeal
	 * @returns {{
	 * 	 appealId: number,
	 * 	 appealReference: string,
	 * 	 appealSite: {addressLine1?: string, addressLine2?: string, town?: string, county?: string, postCode?: string | null},
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
	})
};

export default appealFormatter;
