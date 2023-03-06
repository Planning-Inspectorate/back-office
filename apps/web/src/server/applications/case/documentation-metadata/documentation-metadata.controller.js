import { url } from '../../../lib/nunjucks-filters/url.js';
import { updateDocumentMetaData } from './documentation-metadata.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {"name" | "description"| "published-date" | "received-date"| "redaction" |"type"} MetaDataNames */
/** @typedef {{label?: string, metaDataName: string, hint?: string, pageTitle: string, backLink?: string, items?: {value: boolean|string, text: string}[]}} MetaDataLayoutParams */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {{caseId: number, folderId: number }} ResponseLocals */

// TODO: replace the metadataname field witht the correct field name from api

/** @type {Record<MetaDataNames, MetaDataLayoutParams>} */
const layouts = {
	name: {
		label: 'What is the file name?',
		hint: 'There is a limit of 255 characters',
		pageTitle: 'Enter file name',
		metaDataName: 'documentName'
	},
	description: {
		label: 'Description of the document',
		hint: 'There is a limit of 800 characters',
		pageTitle: 'Enter document description',
		metaDataName: 'description'
	},
	'published-date': {
		label: 'Date document published',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document published date',
		metaDataName: 'publishedDate'
	},
	'received-date': {
		label: 'Date document received',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document receipt date',
		metaDataName: 'receivedDate'
	},
	redaction: {
		items: [
			{ value: true, text: 'Redacted' },
			{ value: false, text: 'Unredacted' }
		],
		pageTitle: 'Select the redaction status',
		metaDataName: 'redacted'
	},
	type: {
		items: [
			{
				value: 'rule_8_letter',
				text: 'Rule 8 letter'
			},
			{
				value: 'exam_library',
				text: 'Exam library'
			},
			{
				value: 'no_type',
				text: 'No document type'
			}
		],
		metaDataName: 'type',
		pageTitle: 'Select the document type'
	}
};

/**
 * View the page for editing/creating documentation metadata
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, RequestParams, ResponseLocals>}
 */
export async function viewDocumentationMetaData({ params }, response) {
	const layout = getLayoutParameters(params, response.locals);

	response.render(`applications/case-documentation/documentation-edit.njk`, { layout });
}

/**
 * Update changes for documentation metadata or return errors
 *
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, Partial<Record<string, any>>, {}, RequestParams, ResponseLocals>}
 */
export async function updateDocumentationMetaData(request, response) {
	const { errors: validationErrors, params, body } = request;
	const { caseId } = response.locals;
	const { documentGuid, metaDataName } = params;

	let newMetaData = body;

	if (metaDataName === 'published-date' || metaDataName === 'received-date') {
		const newValue = `${body[`${metaDataName}.year`]}-${body[`${metaDataName}.month`]}-${
			body[`${metaDataName}.day`]
		}`;

		newMetaData = { [metaDataName]: newValue };
	}

	const { errors: apiErrors } = await updateDocumentMetaData(caseId, documentGuid, newMetaData);

	if (validationErrors || apiErrors) {
		const layout = getLayoutParameters(params, response.locals);

		return response.render(`applications/case-documentation/documentation-edit.njk`, {
			errors: validationErrors || apiErrors,
			layout
		});
	}
	response.redirect('../properties');
}

/**
 * Create layout parameters for metadata pages
 *
 * @param {RequestParams} requestParameters
 * @param {ResponseLocals} responseLocals
 * @returns {MetaDataLayoutParams}
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

	return { ...layout, backLink };
};
