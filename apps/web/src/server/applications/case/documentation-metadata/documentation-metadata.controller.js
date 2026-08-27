import { updateDocumentMetaData } from './documentation-metadata.service.js';
import { setSessionBanner } from '../../common/services/session.service.js';
import { getMetadataViewModel, viewModels } from './documentation-metadata.view-model.js';
import { mapMetadataFormToApi } from './documentation-metadata.mappers.js';

/** @typedef {"name" | "description" | "descriptionWelsh" | "published-date" | "receipt-date"| "redaction" | "published-status" | "type"|"webfilter" | "webfilterWelsh" | "agent"| "author" | "authorWelsh" | "transcript" | "interestedPartyNumber" | "party-type"|"examination-library-category"} MetaDataNames */
/** @typedef {{documentGuid: string, metaDataName: MetaDataNames}} RequestParams */
/** @typedef {import('../../applications.types').DocumentationFile} DocumentationFile */
/** @typedef {{case: {isMaterialChange: boolean}, caseId: number, folderId: number, documentMetaData: DocumentationFile, documentGuid: string}} ResponseLocals */

/**
 * View the page for editing/creating documentation metadata
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, RequestParams, ResponseLocals>}
 */
export async function viewDocumentationMetaData({ params }, response, next) {
	const viewModel = await getMetadataViewModel(params, response.locals);
	if (!viewModel) {
		return next();
	}

	const noPublish = ['awaiting_upload', 'awaiting_virus_check', 'failed_virus_check'].includes(
		response.locals.documentMetaData.publishedStatus
	);
	if (noPublish && params.metaDataName === 'published-status') {
		// deny status update if document hasn't passed virus check yet
		viewModel.items = [];
		return response.status(403).redirect('/app/403');
	}

	const template = viewModel.template ?? 'documentation-edit.njk';

	response.render(`applications/case-documentation/${template}`, { layout: viewModel, noPublish });
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

	let newMetaData = mapMetadataFormToApi(metaDataName, body);

	if (metaDataName === 'published-date' || metaDataName === 'receipt-date') {
		const fieldName = viewModels[metaDataName].metaDataName;

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
		const viewModel = await getMetadataViewModel(params, response.locals);

		// @ts-ignore
		const errors = Object.entries(validationErrors || apiErrors).reduce((result, [key, value]) => {
			if (typeof value === 'string') {
				return { ...result, [key]: { msg: value } };
			} else {
				return { ...result, [key]: value };
			}
		}, {});

		return response.render(
			`applications/case-documentation/${viewModel?.template ?? 'documentation-edit.njk'}`,
			{ errors, layout: viewModel }
		);
	}

	setSessionBanner(session, `${viewModels[metaDataName].label} updated`);

	response.redirect('../properties');
}
