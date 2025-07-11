import pino from '../../lib/logger.js';
import { url } from '../../lib/nunjucks-filters/index.js';
import { getCase } from '../common/services/case.service.js';
import {
	getCaseDocumentationFolderPath,
	getCaseFolder
} from './documentation/applications-documentation.service.js';
import { featureFlagClient } from '../../../common/feature-flags.js';
import config from '../../../../environment/config.js';

/**
 * @typedef {object} ApplicationCaseLocals
 * @property {number} caseId
 * @property {number} folderId
 * @property {import('../applications.types').Case} Case
 */

/** @typedef {{href: string, text: string}} BreadcrumbItem */

/**
 * @typedef {object} FolderLocals
 * @property {import('../applications.types').DocumentationCategory} currentFolder
 * @property {Array<BreadcrumbItem>} breadcrumbItems
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
		response.locals.caseIsWelsh =
			(await featureFlagClient.isFeatureActive('applic-55-welsh-translation')) &&
			response.locals.case?.geographicalInformation?.regions?.some(
				(/** @type {{name: string}} */ r) => r.name === 'wales'
			);
	} catch (/** @type {*} */ error) {
		return response.render(`app/${error.message === '404' ? 404 : 500}.njk`, { error });
	}

	if (response.locals.case.status === 'Draft') {
		pino.error('[WEB] Trying to load a non-draft page for a draft case');
		return response.render(`app/404.njk`);
	}

	response.locals.frontOfficeProjectUrl = `${config.frontOfficeURL}/projects/${response.locals.case.reference}`;

	const gridReference = response.locals.case.geographicalInformation?.gridReference;

	if (gridReference) {
		const { easting, northing } = gridReference;

		gridReference.easting = easting?.toString().padStart(6, '0') || '';
		gridReference.northing = northing?.toString().padStart(6, '0') || '';

		response.locals.case.geographicalInformation.gridReference = gridReference;
	}

	next();
};

/**
 * Register the folder id (withouth the rest of the folder info)
 *
 * @type {import('@pins/express').RequestHandler<ApplicationCaseLocals>}
 */
export const registerFolderId = async ({ params }, response, next) => {
	const folderId = Number.parseInt(params.folderId, 10);

	response.locals.folderId = folderId;

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
	response.locals.breadcrumbItems = await buildBreadcrumbItems(caseId, folderId);

	next();
};

/**
 * Register and validate the documentGuid
 *
 * @type {import('@pins/express').RequestHandler<ApplicationCaseLocals>}
 */
export const registerDocumentGuid = async ({ params }, response, next) => {
	const documentGuid = params.documentGuid || params.documentId;

	if (!/^[A-Za-z0-9-]+$/.test(documentGuid)) {
		pino.error(`[WEB] Document guid not valid: ${documentGuid}`);
		return response.render(`app/500.njk`);
	}

	response.locals.documentGuid = documentGuid;
	next();
};

/**
 * Returns a set of folder breadcrumbs for a particular folder in a case
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns {Promise<BreadcrumbItem[]>}
 */
export const buildBreadcrumbItems = async (caseId, folderId) => {
	/** @type {BreadcrumbItem[]} **/
	let folderItems = [];
	if (folderId) {
		const folderPath = await getCaseDocumentationFolderPath(caseId, folderId);
		folderItems = folderPath.map((folder) => ({
			href: url('document-category', { caseId, documentationCategory: folder }),
			text: folder.displayNameEn
		}));
	}

	return [
		{
			href: url('case-view', { caseId }),
			text: 'Project overview'
		},
		{
			href: url('case-view', { caseId, step: 'project-documentation' }),
			text: 'Project documentation'
		},
		...folderItems
	];
};
