import { url } from '../../../lib/nunjucks-filters/url.js';
import { updateDocumentMetaData } from './documentation-metadata.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {"name" | "description"| "published-date" | "receipt-date"| "redaction" | "published-status" | "type"|"webfilter"|"agent"| "author"} MetaDataNames */
/** @typedef {{label?: string, metaDataName: string, hint?: string, pageTitle: string, backLink?: string, maxLength?: number, items?: {value: boolean|string, text: string}[]}} MetaDataLayoutParams */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */
/** @typedef {{caseId: number, folderId: number, documentMetaData: DocumentationFile}} ResponseLocals */

/** @type {Record<MetaDataNames, MetaDataLayoutParams>} */
const layouts = {
	name: {
		label: 'What is the file name?',
		hint: 'There is a limit of 255 characters',
		pageTitle: 'Enter file name',
		metaDataName: 'fileName',
		maxLength: 255
	},
	description: {
		label: 'Description of the document',
		hint: 'There is a limit of 800 characters',
		pageTitle: 'Enter document description',
		metaDataName: 'description',
		maxLength: 800
	},
	webfilter: {
		label: 'Webfilter',
		hint: 'There is a limit of 100 characters',
		pageTitle: 'Enter the webfilter',
		metaDataName: 'filter1',
		maxLength: 100
	},
	agent: {
		label: 'Agent name (optional)',
		hint: 'There is a limit of 150 characters',
		pageTitle: 'Enter the name of the agent',
		metaDataName: 'representative',
		maxLength: 150
	},
	author: {
		label: 'Document from',
		hint: 'There is a limit of 150 characters',
		pageTitle: 'Enter who the document is from',
		metaDataName: 'author',
		maxLength: 150
	},
	'published-date': {
		label: 'Date document published',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document published date',
		metaDataName: 'datePublished'
	},
	'receipt-date': {
		label: 'Date document received',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document receipt date',
		metaDataName: 'dateCreated'
	},
	redaction: {
		items: [
			{ value: 'redacted', text: 'Redacted' },
			{ value: 'not_redacted', text: 'Unredacted' }
		],
		pageTitle: 'Select the redaction status',
		metaDataName: 'redactedStatus'
	},
	'published-status': {
		items: [
			{ value: 'not_checked', text: 'Not checked' },
			{ value: 'checked', text: 'Checked' },
			{ value: 'ready_to_publish', text: 'Ready to publish' },
			{ value: 'do_not_publish', text: 'Do not publish' }
		],
		pageTitle: 'Select the document status',
		metaDataName: 'publishedStatus'
	},
	type: {
		items: [
			{
				value: 'DCO decision letter (SoS)(approve)',
				text: 'DCO decision letter (SoS)(approve)'
			},
			{
				value: 'DCO decision letter (SoS)(refuse)',
				text: 'DCO decision letter (SoS)(refuse)'
			},
			{
				value: 'Exam library',
				text: 'Exam library'
			},
			{
				value: 'Rule 6 letter',
				text: 'Rule 6 letter'
			},
			{
				value: 'Rule 8 letter',
				text: 'Rule 8 letter'
			},
			{
				value: '',
				text: 'No document type'
			}
		],
		metaDataName: 'documentType',
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

	const noPublish = ['awaiting_upload', 'awaiting_virus_check', 'failed_virus_check'].includes(
		response.locals.documentMetaData.publishedStatus
	);
	if (noPublish) {
		layout.items = layout.items?.filter((item) => item.value !== 'ready_to_publish');
	}

	response.render(`applications/case-documentation/documentation-edit.njk`, { layout, noPublish });
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

	if (metaDataName === 'published-date' || metaDataName === 'receipt-date') {
		const fieldName = layouts[metaDataName].metaDataName;
		const newValue = `${body[`${fieldName}.year`]}-${body[`${fieldName}.month`]}-${
			body[`${fieldName}.day`]
		}`;

		newMetaData = { [fieldName]: new Date(newValue) };
	}
	// special case for documentType "No document type" - we need to send null to the api
	if (metaDataName === 'type' && newMetaData.documentType === '') {
		newMetaData.documentType = null;
	}

	const { errors: apiErrors } = validationErrors
		? { errors: validationErrors }
		: await updateDocumentMetaData(caseId, documentGuid, newMetaData);

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
