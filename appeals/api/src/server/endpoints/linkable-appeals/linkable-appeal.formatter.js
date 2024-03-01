/**
 *
 * @param {import("#endpoints/appeals.js").RepositoryGetByIdResultItem} appeal
 * @returns {import('@pins/appeals.api').Appeals.LinkableAppealSummary}
 */
export const formatLinkableAppealSummary = (appeal) => {
	return {
		appealId: appeal.id.toString(),
		appealReference: appeal.reference,
		appealType: appeal.appealType?.type,
		appealStatus: appeal.appealStatus[0].status,
		siteAddress: {
			addressLine1: appeal.address?.addressLine1 || '',
			addressLine2: appeal.address?.addressLine2 || '',
			town: appeal.address?.addressTown || '',
			county: appeal.address?.addressCounty || '',
			postCode: appeal.address?.postcode || ''
		},
		localPlanningDepartment: appeal.lpa.name,
		appellantName: `${appeal.appellant?.firstName} ${appeal.appellant?.lastName}`,
		agentName: appeal.agent
			? `${appeal.agent?.firstName} ${appeal.agent?.lastName} ${
					appeal.agent?.organisationName ? '(' + appeal.agent?.organisationName + ')' : ''
			  }`
			: 'No agent',
		submissionDate: new Date(appeal.createdAt).toISOString(),
		source: 'back-office'
	};
};
