import { sortBy } from 'lodash-es';
import { getCaseDocumentationCategories } from '../../../lib/services/case.service.js';

/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */

/**
 * View the documentation for a single case
 *
 * @type {import('@pins/express').RenderHandler<{documentationCategories: DocumentationCategory[]}, {}>}
 */
export async function viewApplicationsCaseDocumentationCategories(request, response) {
	const { caseId } = response.locals;
	const documentationCategories = await getCaseDocumentationCategories(caseId);

	const properties = { documentationCategories: sortBy(documentationCategories, ['displayOrder']) };

	response.render(`applications/case/project-documentation`, properties);
}

// TODO: define propTypes
/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<{currentFolder: string, nextPageUrl: string, folderId: string, caseId: string}, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	const { folderId, caseId } = request.params;
	// TODO: define next page router and controller
	const nextPageUrl = 'next/page/url';
	// TODO: connect to the :folderId/parents-folder endpoint
	const currentFolder = 'Subfolder Placeholder';
	const properties = { currentFolder, folderId, caseId, nextPageUrl };

	response.render(`applications/documentation/upload`, properties);
}

// TODO: fix the properties types
// TODO: this should be moved to a generic component valid for both appeals and applications
/**
 * Get info for the blob storage upload
 *
 * @param {*} request
 * @param {*} response
 * @returns {Promise<Array<*>>}
 */
export async function postApplicationsCaseDocumentationUpload(request, response) {
	// TODO: call the API and get the necessary information for the blob storage upload
	// TODO: set the proper type for the api response/controller return
	const APIResponse = request.body;

	return response.send(APIResponse);
}
