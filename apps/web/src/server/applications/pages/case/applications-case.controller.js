import { getCaseDocumentsCategories } from '../../lib/services/case.service.js';

/** @typedef {import('../../applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('../../applications.types').Case} Case */
/** @typedef {import('../../applications.types').DocumentCategory} DocumentCategory */

/**
 * @typedef {object} viewApplicationsCasePagesProps
 * @property {string} selectedPageType
 * @property {DocumentCategory[]=} documentCategories
 */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<viewApplicationsCasePagesProps, {}>}
 */
export async function viewApplicationsCasePages(request, response) {
	// note: casedetails for this case are held in response.locals.case
	const pageType = request.params.pageType ?? 'overview';

	/** @type {DocumentCategory[]} */
	const documentCategories = [];

	let properties = { selectedPageType: pageType, documentCategories };

	if (pageType === 'project-documentation') {
		const caseId = response.locals.applicationId;
		const caseDocumentCategories = await getCaseDocumentsCategories(caseId);

		properties = { ...properties, documentCategories: caseDocumentCategories };
	}

	response.render(`applications/case/${pageType}`, properties);
}
