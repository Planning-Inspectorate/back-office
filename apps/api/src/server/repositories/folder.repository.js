import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({ where: { caseId } });
};

export const createFolders = (/** @type {number} */ caseId) => {
	const createdFolders = {
		data: defaultCaseFolders.map((folder) => ({ ...folder, caseId }))
	};

	return databaseConnector.folder.createMany(createdFolders);
};

const defaultCaseFolders = [
	{ displayNameEn: 'Project management', displayOrder: 100 },
	{ displayNameEn: 'Legal advice', displayOrder: 200 },
	{ displayNameEn: 'Transboundary', displayOrder: 300 },
	{ displayNameEn: 'Legal rights', displayOrder: 400 },
	{ displayNameEn: 'S51 advice', displayOrder: 500 },
	{ displayNameEn: 'Pre-application', displayOrder: 600 },
	{ displayNameEn: 'Acceptance', displayOrder: 700 },
	{ displayNameEn: 'Relevant representation', displayOrder: 800 },
	{ displayNameEn: 'Examination', displayOrder: 900 },
	{ displayNameEn: 'Decision', displayOrder: 1000 },
	{ displayNameEn: 'Post-decision', displayOrder: 1100 }
];
