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
