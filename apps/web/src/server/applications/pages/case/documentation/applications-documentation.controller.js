import { sortBy } from 'lodash-es';
import { getCaseDocumentationCategories } from '../../../lib/services/case.service.js';

/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */
/** @typedef {import('./applications-documentation.types').CaseDocumentationUploadProps} CaseDocumentationUploadProps */

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
 * @type {import('@pins/express').RenderHandler<CaseDocumentationUploadProps, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	const { folderId, caseId } = request.params;
	// TODO: define next page router and controller
	const nextPageUrl = 'next/page/url';
	// TODO: connect to the :folderId/parents-folder endpoint
	const currentFolder = 'Subfolder Placeholder';
	const properties = { currentFolder, folderId, caseId, nextPageUrl };

	response.render(`applications/case-documentation/upload`, properties);
}
