/**
 *
 * @param {import("#endpoints/appeals.js").RepositoryGetByIdResultItem} appeal
 * @returns {import("#utils/horizon-gateway.js").LinkableAppealSummary}
 */
export const formattedLinkableAppealSummary = (appeal) => {
	return {
		appealReference: appeal.reference,
		appealType: appeal.appealType?.type,
		appealStatus: appeal.appealStatus[0].status,
		siteAddress: {
			siteAddressLine1: appeal.address?.addressLine1,
			siteAddressLine2: appeal.address?.addressLine2,
			siteAddressTown: appeal.address?.addressTown,
			siteAddressCounty: appeal.address?.addressCounty,
			siteAddressPostcode: appeal.address?.postcode
		},
		localPlanningDepartment: appeal.lpa.name,
		appellantName: appeal.appellant?.name,
		agentName: appeal.agent?.name,
		submissionDate: new Date(appeal.createdAt).toISOString()
	};
};
