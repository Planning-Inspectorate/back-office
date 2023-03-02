import { url } from '../../../lib/nunjucks-filters/url.js';
import { updateDocumentMetaData } from './documentation-metadata.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {"name" | "description"} MetaDataNames */
/** @typedef {{label: string, hint: string, pageTitle: string}} MetaDataLayoutParams */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {{caseId: number, folderId: number}} ResponseLocals */

/** @type {Record<MetaDataNames, MetaDataLayoutParams>} */
const layouts = {
	name: {
		label: 'What is the file name?',
		hint: 'There is a limit of 255 characters',
		pageTitle: 'Enter file name'
	},
	description: {
		label: 'Description of the document',
		hint: 'There is a limit of 800 characters',
		pageTitle: 'Enter document description'
	}
};

/**
 * View the page for editing/creating documentation metadata
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, RequestParams, ResponseLocals>}
 */
export async function viewDocumentationMetaData({ params }, response) {
	const layoutParameters = getLayoutParameters(params, response.locals);

	response.render(`applications/case-documentation/documentation-edit.njk`, layoutParameters);
}

/**
 * Update changes for documentation metadata or return errors
 *
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, RequestParams, ResponseLocals>}
 */
export async function updateDocumentationMetaData(request, response) {
	const { errors: validationErrors, params, body } = request;
	const { caseId } = response.locals;
	const { documentGuid } = params;

	const { errors: apiErrors } = await updateDocumentMetaData(caseId, documentGuid, body);

	if (validationErrors || apiErrors) {
		const layoutParameters = getLayoutParameters(params, response.locals);

		return response.render(`applications/case-documentation/documentation-edit.njk`, {
			errors: validationErrors || apiErrors,
			...layoutParameters
		});
	}
	response.redirect('../properties');
}

/**
 * Create layout parameters for metadata pages
 *
 * @param {RequestParams} requestParameters
 * @param {ResponseLocals} responseLocals
 * @returns {{metaDataName: MetaDataNames, layout: MetaDataLayoutParams, backLink: string }}
 */
const getLayoutParameters = (requestParameters, responseLocals) => {
	const { documentGuid, metaDataName } = requestParameters;
	const { caseId, folderId } = responseLocals;

	const backLink = url('document', {
		caseId,
		folderId,
		documentGuid,
		step: 'properties'
	});

	const layout = layouts[metaDataName];

	return {
		metaDataName,
		layout,
		backLink
	};
};
