import { makePostRequest } from '../back-office-api-client.js';

export const migrateFoldersForCase = async (logger, caseReference) => {
	try {
		await makePostRequest(logger, '/migration/folder', {
			caseReference
		});
	} catch (e) {
		throw new Error(`Failed to migrate Folders for case ${caseReference}`, { cause: e });
	}
};
