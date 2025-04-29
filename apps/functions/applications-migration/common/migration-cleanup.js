import { makePostRequestStreamResponse } from './back-office-api-client.js';

/**
 *
 * @param {*} log
 * @param {string} caseReference
 * @param {boolean} skipLooseS51Attachments
 * @param {boolean} skipHtmlTransform
 * @param {boolean} skipFixExamFolders
 * @returns
 */
export const startMigrationCleanup = async (
	log,
	caseReference,
	skipLooseS51Attachments,
	skipHtmlTransform,
	skipFixExamFolders
) => {
	log.info(`Making API request to start migration for case: ${caseReference}`);
	return makePostRequestStreamResponse(log, '/migration/cleanup', {
		caseReference,
		skipLooseS51Attachments,
		skipHtmlTransform,
		skipFixExamFolders
	});
};
