import { makePostRequest } from '../back-office-api-client.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateFolders = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		await migrateFoldersForCase(logger, caseReference);
	}
};

export const migrateFoldersForCase = async (logger, caseReference) => {
	try {
		logger.info(`migrating Folders with caseReference ${caseReference}`);
		await makePostRequest(logger, '/migration/folder', {
			caseReference
		});
	} catch (e) {
		logger.error(`Failed to migrate Folders for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
};
