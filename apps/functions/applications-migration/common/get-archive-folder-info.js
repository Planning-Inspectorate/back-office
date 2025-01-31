import { makeGetRequest } from './back-office-api-client.js';

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 * @returns {Promise<Object>}
 */
export const getArchiveFolderInfo = async (log, caseReferences) => {
	log.info(`Getting archive folder info for cases: ${JSON.stringify(caseReferences)}`);
	return await makeGetRequest(log, '/migration/archive-folder-info', { caseReferences });
};
