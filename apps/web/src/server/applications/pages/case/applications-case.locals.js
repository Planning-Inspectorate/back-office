import { url } from '../../../lib/nunjucks-filters/index.js';
import { getCase } from '../../lib/services/case.service.js';
import {
	getCaseDocumentationFolderPath,
	getCaseFolder
} from './documentation/applications-documentation.service.js';

/**
 * @typedef {object} ApplicationCaseLocals
 * @property {number} caseId
 * @property {number} folderId
 * @property {import('../../applications.types').Case} Case
 */

/**
 * @typedef {object} FolderLocals
 * @property {import('../../applications.types').DocumentationCategory} currentFolder
 * @property {Array<{href: string, text: string}>} breadcrumbItems
 */

/**
 * Use the `caseId` parameter to install the Case onto the request
 * locals, for consumption in subsequent guards and controllers.
 *
 * @type {import('@pins/express').RequestHandler<ApplicationCaseLocals>}
 */
export const registerCase = async (request, response, next) => {
	response.locals.caseId = Number(request.params.caseId);

	try {
		response.locals.case = await getCase(response.locals.caseId);
	} catch (/** @type {*} */ error) {
		return response.render(`app/${error.message === '404' ? 404 : 500}.njk`, { error });
	}

	if (response.locals.case.status === 'Draft') {
		throw new Error(`Trying to load a non-draft page for a draft case`);
	}

	next();
};

/**
 * Register the current folder and the items (url and text) for the breadcrumbs component
 *
 * @type {import('@pins/express').RequestHandler<ApplicationCaseLocals>}
 */
export const registerFolder = async ({ params }, response, next) => {
	const folderId = Number.parseInt(params.folderId, 10);
	const { caseId } = response.locals;

	response.locals.folderId = folderId;

	// get the current folder
	response.locals.currentFolder = await getCaseFolder(caseId, folderId);

	// get the folderTree for breadcrumbs
	const folderPath = await getCaseDocumentationFolderPath(caseId, folderId);
	const breadcrumbItems = folderPath.map((folder) => ({
		href: url('document-category', { caseId, documentationCategory: folder }),
		text: folder.displayNameEn
	}));

	breadcrumbItems.unshift({
		href: url('case-view', { caseId, step: 'project-documentation' }),
		text: 'Project documentation'
	});
	response.locals.breadcrumbItems = breadcrumbItems;

	next();
};
