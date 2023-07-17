/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */

/**
 * Returns a list of document paths available for the current Appeal
 * @param {number} caseId
 * @returns {FolderTemplate[]}
 */
export const defaultCaseFolders = (caseId) => {
	return [
		{
			caseId,
			path: 'appellantCase/appealStatement',
			displayName: 'Appeal statement from appellant'
		},
		{ caseId, path: 'appellantCase/applicationForm' },
		{ caseId, path: 'appellantCase/decisionLetter' },
		{ caseId, path: 'appellantCase/designAndAccessStatement' },
		{ caseId, path: 'appellantCase/planningObligation' },
		{ caseId, path: 'appellantCase/plansDrawingsSupportingDocuments' },
		{ caseId, path: 'appellantCase/separateOwnershipCertificate' },
		{ caseId, path: 'appellantCase/newSupportingDocuments' }
		// { caseId, path: 'lpaQuestionnaire/communityInfrastructureLevy' },
		// { caseId, path: 'lpaQuestionnaire/conservationAreaMapAndGuidance' },
		// { caseId, path: 'lpaQuestionnaire/consultationResponses' },
		// { caseId, path: 'lpaQuestionnaire/definitiveMapAndStatement' }
	];
};
