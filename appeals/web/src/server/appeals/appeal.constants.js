export const paginationDefaultSettings = {
	pageSize: 30,
	firstPageNumber: 1
};

/**
 * @type {Object<string, Object<string, string>>}
 */
export const notificationBanners = {
	siteVisitTypeSelected: {
		type: 'success',
		text: 'Site visit type has been selected'
	},
	allocationDetailsUpdated: {
		type: 'success',
		text: 'Allocation details updated'
	},
	caseOfficerAdded: {
		type: 'success',
		text: 'Case officer has been assigned'
	},
	inspectorAdded: {
		type: 'success',
		text: 'Inspector has been assigned'
	},
	caseOfficerRemoved: {
		type: 'success',
		text: 'Case officer has been removed'
	},
	inspectorRemoved: {
		type: 'success',
		text: 'Inspector has been removed'
	}
};

export const textInputCharacterLimits = {
	appellantCaseNotValidReason: 1000,
	lpaQuestionnaireNotValidReason: 1000
};
