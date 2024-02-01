/**
 *
 * @param {import("#endpoints/appeals.js").RepositoryGetByIdResultItem} appeal
 * @returns {import("./linkable-appeals.service.js").LinkableAppealSummary}
 */
export const formatLinkableAppealSummary = (appeal) => {
	return {
		appealId: appeal.id.toString(),
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
		appellantName: `${appeal.appellant?.firstName} ${appeal.appellant?.lastName}`,
		agentName: `${appeal.agent?.firstName} ${appeal.agent?.lastName} ${
			appeal.agent?.organisationName ? '(' + appeal.agent?.organisationName + ')' : ''
		}`,
		submissionDate: new Date(appeal.createdAt).toISOString(),
		source: 'back-office'
	};
};
