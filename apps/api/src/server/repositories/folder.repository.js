import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({ where: { caseId } });
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

/**
 *
 * @param {number} folderId
 * @returns {Promise<import('@pins/api').Schema.Folder | null>}
 */
export const getById = (folderId) => {
	return databaseConnector.folder.findUnique({ where: { id: folderId } });
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
