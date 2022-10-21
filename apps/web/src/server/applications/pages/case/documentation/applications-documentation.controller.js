import { getCaseDocumentationCategories } from '../../../lib/services/case.service.js';

/** @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory */

/**
 * View the details for a single case application
 *
 * @type {import('@pins/express').RenderHandler<{documentationCategories: DocumentationCategory[]}, {}>}
 */
export async function viewApplicationsCaseDocumentationCategories(request, response) {
	const caseId = response.locals.applicationId;
	const documentationCategories = await getCaseDocumentationCategories(caseId);

	const properties = { documentationCategories };

	response.render(`applications/case/project-documentation`, properties);
}
