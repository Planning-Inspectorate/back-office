import { makePostRequestStreamResponse } from './back-office-api-client.js';

export const startMigrationCleanup = async (log, caseReference, skipHtmlTransform) => {
	log.info(`Making API request to start migration for case: ${caseReference}`);
	return makePostRequestStreamResponse(log, '/migration/cleanup', {
		caseReference,
		skipHtmlTransform
	});
};
