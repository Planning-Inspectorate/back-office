import { databaseConnector } from '../utils/database-connector.js';

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @param {number |null} parentFolderId
 * @returns {Promise<import('@pins/api').Schema.Folder[]>}
 */
export const getByCaseId = (caseId, parentFolderId) => {
	// if no parentFolderId, explicitly set null value im the call, to get the tope level folders on the case
	return parentFolderId
		? databaseConnector.folder.findMany({ where: { caseId, parentFolderId } })
		: databaseConnector.folder.findMany({ where: { caseId, parentFolderId: null } });
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createFolders = (caseId) => {
	const createdFolders = {
		data: defaultCaseFolders.map((folder) => ({ ...folder, caseId }))
	};

	return databaseConnector.folder.createMany(createdFolders);
};

export const defaultCaseFolders = [
	{ displayNameEn: 'Project management', displayOrder: 100 },
	{ displayNameEn: 'Legal advice', displayOrder: 200 },
	{ displayNameEn: 'Transboundary', displayOrder: 300 },
	{ displayNameEn: 'Land rights', displayOrder: 400 },
	{ displayNameEn: 'S51 advice', displayOrder: 500 },
	{ displayNameEn: 'Pre-application', displayOrder: 600 },
	{ displayNameEn: 'Acceptance', displayOrder: 700 },
	{ displayNameEn: 'Pre-examination', displayOrder: 800 },
	{ displayNameEn: 'Relevant representations', displayOrder: 900 },
	{ displayNameEn: 'Examination', displayOrder: 1000 },
	{ displayNameEn: 'Recommendation', displayOrder: 1100 },
	{ displayNameEn: 'Decision', displayOrder: 1200 },
	{ displayNameEn: 'Post-decision', displayOrder: 1300 }
];
