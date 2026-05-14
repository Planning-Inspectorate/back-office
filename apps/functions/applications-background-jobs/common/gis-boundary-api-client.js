import { requestWithApiKey } from './backend-api-request.js';
import config from './config.js';

/**
 * @returns {Promise<Array<{
 * caseId: number,
 * caseReference: string,
 * projectName: string,
 * documentGuid: string,
 * version: number,
 * publishedBlobContainer: string,
 * publishedBlobPath: string
 * }>>}
 */
export const getPublishedGisBoundaryDocuments = async () => {
	return requestWithApiKey
		.get(`https://${config.API_HOST}/applications/documents/gis-boundaries/published`)
		.json();
};
