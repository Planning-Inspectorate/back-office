import { url } from '../../../lib/nunjucks-filters/url.js';
import { updateDocumentMetaData } from './documentation-metadata.service.js';
import { setSessionBanner } from '../../common/services/session.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {"name" | "description" | "descriptionWelsh" | "published-date" | "receipt-date"| "redaction" | "published-status" | "type"|"webfilter" | "webfilterWelsh" | "agent"| "author" | "authorWelsh" | "transcript" | "interestedPartyNumber"} MetaDataNames */
/** @typedef {{label?: string, metaDataName: string, metaDataType?: string, hint?: string, pageTitle?: string, backLink?: string, maxLength?: number, template?: string, englishLabel?: string, metaDataEnglishName?: string, items?: {value: boolean|string, text: string, checked?: boolean}[]}} MetaDataLayoutParams */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */
/** @typedef {{caseId: number, folderId: number, documentMetaData: DocumentationFile, documentGuid: string}} ResponseLocals */

/** @type {Record<MetaDataNames, MetaDataLayoutParams>} */
const layouts = {
	name: {
		label: 'Document file name',
		metaDataName: 'fileName',
		template: 'documentation-edit-textinput.njk'
	},
	description: {
		label: 'Document description',
		metaDataName: 'description',
		template: 'documentation-edit-textarea.njk'
	},
	descriptionWelsh: {
		label: 'Document description in Welsh',
		metaDataName: 'descriptionWelsh',
		englishLabel: 'Document description in English',
		metaDataEnglishName: 'description',
		template: 'documentation-edit-textarea.njk'
	},
	interestedPartyNumber: {
		label: 'Interested Party number (optional)',
		metaDataName: 'interestedPartyNumber',
		template: 'documentation-edit-textinput.njk'
	},
	webfilter: {
		label: 'Webfilter',
		metaDataName: 'filter1',
		template: 'documentation-edit-textarea.njk'
	},
	webfilterWelsh: {
		label: 'Webfilter in Welsh',
		metaDataName: 'filter1Welsh',
		englishLabel: 'Webfilter in English',
		metaDataEnglishName: 'filter1',
		template: 'documentation-edit-textarea.njk'
	},
	agent: {
		label: 'Agent name (optional)',
		metaDataName: 'representative',
		template: 'documentation-edit-textinput.njk'
	},
	author: {
		label: 'Who the document is from',
		metaDataName: 'author',
		template: 'documentation-edit-textarea.njk'
	},
	authorWelsh: {
		label: 'Who the document is from in Welsh',
		englishLabel: 'Who the document is from in English',
		metaDataName: 'authorWelsh',
		metaDataEnglishName: 'author',
		template: 'documentation-edit-textarea.njk'
	},
	'published-date': {
		label: 'Date document published',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter the document published date',
		metaDataName: 'datePublished',
		metaDataType: 'date'
	},
	'receipt-date': {
		label: 'Date received',
		hint: 'for example, 27 03 2023',
		pageTitle: 'Enter date received',
		metaDataName: 'dateCreated',
		metaDataType: 'date'
	},
	redaction: {
		items: [
			{ value: 'redacted', text: 'Redacted' },
			{ value: 'not_redacted', text: 'Unredacted', checked: true }
		],
		pageTitle: 'Select the redaction status',
		label: 'Redaction',
		metaDataName: 'redactedStatus',
		metaDataType: 'radios'
	},
	'published-status': {
		items: [
			{ value: 'not_checked', text: 'Not checked' },
			{ value: 'checked', text: 'Checked' },
			{ value: 'ready_to_publish', text: 'Ready to publish' },
			{ value: 'do_not_publish', text: 'Do not publish' }
		],
		pageTitle: 'Select the document status',
		label: 'Status',
		metaDataName: 'publishedStatus',
		metaDataType: 'radios'
	},
	transcript: {
		label: 'Transcript (optional)',
		hint: 'E.g. TR010060-000110',
		metaDataName: 'transcript',
		template: 'documentation-edit-textinput.njk'
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
				value: 'Event recording',
				text: 'Event recording'
			},
			{
				value: 'Event recording transcript',
				text: 'Event recording transcript'
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
		pageTitle: 'Select the document type',
		label: 'Document type',
		metaDataName: 'documentType',
		metaDataType: 'radios'
	}
};

/**
 * View the page for editing/creating documentation metadata
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, RequestParams, ResponseLocals>}
 */
export async function viewDocumentationMetaData({ params }, response, next) {
	const layout = getLayoutParameters(params, response.locals);
	if (!layout) {
		return next();
	}

	const noPublish = ['awaiting_upload', 'awaiting_virus_check', 'failed_virus_check'].includes(
		response.locals.documentMetaData.publishedStatus
	);
	if (noPublish && params.metaDataName === 'published-status') {
		// deny status update if document hasn't passed virus check yet
		layout.items = [];
		return response.status(403).redirect('/app/403');
	}

	const template = layout.template ?? 'documentation-edit.njk';

	response.render(`applications/case-documentation/${template}`, { layout, noPublish });
}

/**
 * Update changes for documentation metadata or return errors
 *
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, Partial<Record<string, any>>, {}, RequestParams, ResponseLocals>}
 */
export async function updateDocumentationMetaData(request, response) {
	const { errors: validationErrors, params, body, session } = request;
	const { caseId, documentGuid } = response.locals;
	const { metaDataName } = params;

	let newMetaData = body;

	if (metaDataName === 'published-date' || metaDataName === 'receipt-date') {
		const fieldName = layouts[metaDataName].metaDataName;

		const day = body[`${fieldName}.day`];
		const month = body[`${fieldName}.month`];
		const year = body[`${fieldName}.year`];

		if (validationErrors && validationErrors[fieldName]) {
			validationErrors[fieldName].value = { year, month, day };
		} else {
			newMetaData = { [fieldName]: new Date(`${year}-${month}-${day}`) };
		}
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

		// @ts-ignore
		const errors = Object.entries(validationErrors || apiErrors).reduce((result, [key, value]) => {
			if (typeof value === 'string') {
				return { ...result, [key]: { msg: value } };
			} else {
				return { ...result, [key]: value };
			}
		}, {});

		return response.render(
			`applications/case-documentation/${layout?.template ?? 'documentation-edit.njk'}`,
			{ errors, layout }
		);
	}

	setSessionBanner(session, `${layouts[metaDataName].label} updated`);

	response.redirect('../properties');
}

/**
 * Create layout parameters for metadata pages
 *
 * @param {RequestParams} requestParameters
 * @param {ResponseLocals} responseLocals
 * @returns {MetaDataLayoutParams | null}
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
	if (!layout) {
		return null;
	}

	return { ...layout, backLink };
};
