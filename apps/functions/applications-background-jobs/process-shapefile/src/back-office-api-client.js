import { requestWithApiKey } from '../../common/backend-api-request.js';
import config from '../../common/config.js';

/**
 * Notifies the back-office API that a GeoJSON has been generated and stored,
 * or that the ZIP is invalid (missing required shapefile components).
 *
 * @param {string} documentGuid
 * @param {{ invalid: true } | { geoJsonFileName: string, geoJsonBlobPath: string, blobContainer: string, geoJsonSizeBytes: number }} payload
 */
export const notifyShapefileProcessingResult = async (documentGuid, payload) => {
	await requestWithApiKey
		.post(`https://${config.API_HOST}/applications/documents/${documentGuid}/process-shapefile`, {
			json: payload
		})
		.json();
};

/**
 * Fetches project title for a case.
 *
 * @param {number} caseId
 * @returns {Promise<string>}
 */
export const getProjectName = async (caseId) => {
	const application = await requestWithApiKey
		.get(`https://${config.API_HOST}/applications/${caseId}?title=true`)
		.json();

	return application?.title ?? '';
};
