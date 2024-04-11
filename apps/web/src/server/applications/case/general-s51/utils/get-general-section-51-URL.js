/**
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns string
 */
export const getGeneralSection51URL = (caseId, folderId) => {
	return `/applications-service/case/${caseId}/project-documentation/${folderId}/s51-advice`;
};
