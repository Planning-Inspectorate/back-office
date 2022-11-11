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

/**
 * View the documentation upload page
 *
 * @type {import('@pins/express').RenderHandler<CaseDocumentationUploadProps, {}>}
 */
export async function viewApplicationsCaseDocumentationUpload(request, response) {
	const { folderId, caseId } = request.params;
	// TODO: connect to the :folderId/parents-folder endpoint
	const currentFolder = {
		displayNameEn: 'Subfolder Placeholder',
		id: Number.parseInt(folderId, 10),
		displayNameCy: 'Subfolder Placeholder',
		name: 'subfolder'
	};
	const properties = { currentFolder, caseId };

	response.render(`applications/case-documentation/upload`, properties);
}
