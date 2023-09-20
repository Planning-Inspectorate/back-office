import { getSessionS51, setSessionS51 } from './applications-s51.session.js';
import {
	checkS51NameIsUnique,
	createS51Advice,
	getS51Advice,
	getS51FilesInFolder,
	updateS51Advice,
	updateS51AdviceStatus,
	getS51AdviceReadyToPublish,
	removeS51AdviceFromReadyToPublish,
	publishS51AdviceItems,
	deleteS51Advice
} from './applications-s51.service.js';
import { paginationParams } from '../../../lib/pagination-params.js';
import {
	destroySuccessBanner,
	getSuccessBanner,
	setSuccessBanner
} from '../../common/services/session.service.js';
import { deleteCaseDocumentationFile } from '../documentation/applications-documentation.service.js';
import {
	getCheckYourAnswersRows,
	getIntegerRequestQuery,
	mapS51AdviceToPage,
	mapUpdateBodyToPayload
} from './applications-s51.mapper.js';

/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreateBody} ApplicationsS51CreateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51UpdatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdateBody} ApplicationsS51UpdateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51ChangeStatusBody} ApplicationsS51ChangeStatusBody */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types.js').S51Advice} S51Advice */
/** @typedef {import('../../applications.types.js').PaginatedResponse<S51Advice>} S51AdvicePaginatedResponse */
/** @typedef {import('../../../lib/pagination-params.js').PaginationParams} PaginationParams */
/** @typedef {import('../../../lib/pagination-params.js').Buttons} Buttons */
/** @typedef {import('express-session').Session & { s51?: Partial<S51Advice> }} SessionWithS51 */
/** @typedef {import('./applications-s51.types.js').S51AdviceForm} S51AdviceForm */

/** @type {Record<any, {nextPage: string}>} */
const createS51Journey = {
	title: { nextPage: 'enquirer' },
	enquirer: { nextPage: 'method' },
	method: { nextPage: 'enquiry-details' },
	'enquiry-details': { nextPage: 'person' },
	person: { nextPage: 'advice-details' },
	'advice-details': { nextPage: 'check-your-answers' }
};

/**
 * Show s51 items folder
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseS51Folder({ query }, response) {
	const { caseId } = response.locals;
	const { items, pagination } = await getS51FolderData(caseId, query);

	response.render(`applications/components/folder/folder`, { items, pagination });
}

/**
 * Update s51 status and redacted status from folder page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51ChangeStatusBody, {size?: string, number?: string}>}
 */
export async function updateApplicationsCaseS51ItemStatus(
	{ query, errors: validationErrors, body },
	response
) {
	const { caseId } = response.locals;
	const { isRedacted, status, selectedFilesIds } = body;

	let apiErrors;
	if (!validationErrors) {
		const items = (selectedFilesIds || []).map((selectField) => ({
			id: Number(selectField)
		}));

		let redacted = isRedacted !== undefined ? isRedacted === '1' : undefined;

		const { errors } = await updateS51AdviceStatus(caseId, {
			redacted,
			status,
			items
		});

		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const { pagination, items } = await getS51FolderData(caseId, query);

		return response.render(`applications/components/folder/folder`, {
			errors: validationErrors || apiErrors,
			pagination,
			items
		});
	}

	response.redirect('../s51-advice');
}

/**
 * Show s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {adviceId: string}>}
 */
export async function viewApplicationsCaseS51Item({ params, session }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, +adviceId);

	const showSuccessBanner = getSuccessBanner(session);
	destroySuccessBanner(session);

	response.render(`applications/case-s51/properties/s51-properties`, {
		s51Advice,
		showSuccessBanner
	});
}

/**
 * Show page for editing s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {caseId: string, adviceId: string, step: string, folderId: string}>}
 */
export async function viewApplicationsCaseEditS51Item({ params }, response) {
	const { caseId, adviceId, step } = params;

	const s51Advice = await getS51Advice(Number(caseId), Number(adviceId));
	const values = mapS51AdviceToPage(s51Advice);

	response.render(`applications/case-s51/properties/edit/s51-edit-${step}`, {
		adviceId,
		values
	});
}

/**
 * Edit s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51UpdateBody, {success: string}, {caseId: string, adviceId: string, step: string, folderId: string}>}
 */
export async function postApplicationsCaseEditS51Item({ body, params }, response) {
	const { adviceId, step } = params;
	const { caseId } = response.locals;

	const payload = mapUpdateBodyToPayload(body);

	if (step === 'title' && body.title) {
		const { errors } = await checkS51NameIsUnique(caseId, body.title);
		return response.render(`applications/case-s51/properties/edit/s51-edit-${step}`, {
			adviceId,
			errors
		});
	}

	const { errors } = await updateS51Advice(caseId, Number(adviceId), payload);

	if (errors) {
		return response.render(`applications/case-s51/properties/edit/s51-edit-${step}`, {
			adviceId,
			errors
		});
	}

	return response.redirect('../properties');
}

/**
 * Show page for uploading s51 attachment
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {adviceId: string}>}
 */
export async function viewApplicationsCaseS51Upload({ params }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, +adviceId);

	response.render(`applications/case-s51/properties/s51-upload`, {
		s51Advice
	});
}

/**
 * Show pages for creating/editing s51 advice
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51AdviceForm> | null}, {}, {}, {}, {step: string}>}
 */
export async function viewApplicationsCaseS51CreatePage(request, response) {
	const { session, params } = request;
	const values = getSessionS51(session);

	response.render(`applications/case-s51/s51-${params.step}`, { values });
}

/**
 * Save data for creating s51 advice
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51AdviceForm> | null, errors: ValidationErrors}, {}, Partial<S51AdviceForm>, {}, {step: string}, {caseId: object}>}
 */
export async function updateApplicationsCaseS51CreatePage(request, response) {
	const { errors: validationErrors, body, session, params } = request;
	const { caseId } = response.locals;

	let apiErrors;
	if (params.step === 'title' && body.title) {
		const { errors } = await checkS51NameIsUnique(+caseId, body.title);
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		return response.render(`applications/case-s51/s51-${params.step}`, {
			values: body,
			errors: validationErrors || apiErrors || {}
		});
	}

	setSessionS51(session, body);
	const { nextPage } = createS51Journey[params.step];
	response.redirect(`../create/${nextPage}`);
}

/**
 * S51 advice - check your answers page
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51AdviceForm> | null, documentationCategory: {id: string, displayNameEn: string}}, {}, {}, {}, {folderId: string}>}
 */
export async function viewApplicationsCaseS51CheckYourAnswers(request, response) {
	const { session, params } = request;

	const s51Data = getSessionS51(session);

	response.render(`applications/case-s51/s51-check-your-answers`, {
		values: getCheckYourAnswersRows(s51Data),
		documentationCategory: {
			id: params.folderId,
			displayNameEn: 's51-advice'
		}
	});
}

/**
 * Save new S51 advice
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {}>}
 */
export async function postApplicationsCaseS51CheckYourAnswersSave({ body, session }, response) {
	/** @type {ApplicationsS51CreatePayload} */
	const payload = {
		caseId: response.locals.caseId,
		title: body.title,
		enquirer: body.enquirer,
		firstName: body.enquirerFirstName,
		lastName: body.enquirerLastName,
		enquiryMethod: body.enquiryMethod,
		enquiryDate: new Date(body.enquiryDate),
		enquiryDetails: body.enquiryDetails,
		adviser: body.adviser,
		adviceDate: new Date(body.adviceDate),
		adviceDetails: body.adviceDetails
	};

	const { errors, newS51Advice } = await createS51Advice(payload);

	if (errors || !newS51Advice?.id) {
		const s51Data = getSessionS51(session);
		return response.render(`applications/case-s51/s51-check-your-answers`, {
			values: getCheckYourAnswersRows(s51Data),
			errors
		});
	}

	setSuccessBanner(session);

	response.redirect(`../../s51-advice/${newS51Advice.id}/properties`);
}

/**
 * View page for deleting S51
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {adviceId: string}>}
 */
export async function viewApplicationsCaseS51Delete({ params }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, +adviceId);

	response.render('applications/case-s51/s51-delete.njk', {
		s51Advice
	});
}

/**
 * Delete S51 advice
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {adviceId: string}>}
 */
export async function deleteApplicationsCaseS51({ params }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const { errors } = await deleteS51Advice(caseId, +adviceId);

	if (errors) {
		const s51Advice = await getS51Advice(caseId, +adviceId);

		return response.render('applications/case-s51/s51-delete.njk', {
			s51Advice,
			errors
		});
	}

	return response.redirect('../');
}

/**
 * View page for deleting S51 attachment
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {adviceId: string, attachmentId: string}>}
 */
export async function viewApplicationsCaseS51AttachmentDelete({ params }, response) {
	const { adviceId, attachmentId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, +adviceId);
	const attachmentToDelete = s51Advice.attachments.find(
		(attachment) => attachment.documentGuid === attachmentId
	);

	response.render('applications/case-s51/s51-delete-attachment.njk', {
		attachment: attachmentToDelete,
		adviceId: adviceId
	});
}

/**
 * Delete the S51 attachment
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {documentName: string, dateAdded: string}, {}, {adviceId: string, attachmentId: string}>}
 */
export async function deleteApplicationsCaseS51Attachment({ params, body }, response) {
	const { adviceId, attachmentId } = params;
	const { caseId } = response.locals;

	const { errors: apiErrors } = await deleteCaseDocumentationFile(
		caseId,
		attachmentId,
		'Your item'
	);

	if (apiErrors) {
		return response.render('applications/case-s51/s51-delete.njk', {
			attachment: body,
			adviceId: adviceId,
			errors: apiErrors
		});
	}

	return response.render('applications/case-s51/s51-successfully-deleted');
}

/**
 * View the s51 publishing queue page
 *
 * @type {import('@pins/express').RenderHandler<{}, any, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseS51PublishingQueue({ query }, response) {
	const { caseId } = response.locals;

	const { paginationButtons, s51Advices } = await getS51PublishinQueueData(caseId, query);

	response.render(`applications/case-s51/s51-publishing-queue`, {
		s51Advices,
		paginationButtons
	});
}

/**
 * Publish S51 advice items
 *
 * @type {import('@pins/express').RenderHandler<{}, any, {selectAll?: boolean, selectedFilesIds: string[]}, {size?: string, number?: string}, {}>}
 * */
export async function publishApplicationsCaseS51Items(request, response) {
	const { caseId } = response.locals;
	const { errors: validationErrors, body } = request;
	const { paginationButtons, s51Advices } = await getS51PublishinQueueData(caseId, request.query);

	if (validationErrors) {
		return response.render(`applications/case-s51/s51-publishing-queue`, {
			paginationButtons,
			s51Advices,
			errors: validationErrors
		});
	}

	const { errors } = await publishS51AdviceItems(caseId, {
		publishAll: Boolean(body.selectAll),
		ids: body.selectedFilesIds
	});

	if (errors) {
		return response.render(`applications/case-s51/s51-publishing-queue`, {
			paginationButtons,
			s51Advices,
			errors
		});
	}

	return response.render('applications/case-s51/s51-successfully-published', {
		items: body.selectedFilesIds.length
	});
}

/**
 * Remove s51 item from the publishing queue
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {adviceId: string}>}
 */
export async function removeApplicationsCaseS51AdviceFromPublishingQueue(
	{ query, params },
	response
) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const { errors } = await removeS51AdviceFromReadyToPublish(caseId, Number(adviceId));

	if (errors) {
		const { paginationButtons, s51Advices } = await getS51PublishinQueueData(caseId, query);

		return response.render(`applications/case-s51/s51-publishing-queue`, {
			paginationButtons,
			s51Advices,
			errors
		});
	}

	return response.redirect('../../');
}

/**
 *
 * @param {number} caseId
 * @param {{size?: string, number?: string}} query
 * @returns {Promise<{items: S51AdvicePaginatedResponse, pagination: null | PaginationParams }>}
 */
const getS51FolderData = async (caseId, query) => {
	const { pageNumber, pageSize } = getIntegerRequestQuery(query, 50);

	const items = await getS51FilesInFolder(caseId, pageNumber, pageSize);
	const pagination = paginationParams(pageSize, pageNumber, items.pageCount);

	return { items, pagination };
};

/**
 *
 * @param {number} caseId
 * @param {{size?: string, number?: string}} query
 * @returns {Promise<{s51Advices: S51AdvicePaginatedResponse, paginationButtons: null | Buttons }>}
 */
const getS51PublishinQueueData = async (caseId, query) => {
	const { pageNumber, pageSize } = getIntegerRequestQuery(query, 25);

	const s51Advices = await getS51AdviceReadyToPublish(caseId, pageNumber, pageSize);

	const pagination = paginationParams(pageSize, pageNumber, s51Advices.pageCount);

	return { s51Advices, paginationButtons: pagination?.buttons || null };
};

/**
 * Show page for editing s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {caseId: string, adviceId: string, step: string, folderId: string}>}
 */
export async function viewUnpublishAdvice({ params }, response) {
	const { caseId, adviceId } = params;

	const s51Advice = await getS51Advice(Number(caseId), Number(adviceId));
	response.render(`applications/case-s51/s51-unpublish`, {
		adviceId,
		s51Advice
	});
}

/**
 * Show page for editing s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {caseId: string, adviceId: string, step: string, folderId: string}>}
 */
export async function postUnpublishAdvice({ params }, response) {
	const { caseId, adviceId } = params;

	await updateS51Advice(Number(caseId), Number(adviceId), { publishedStatus: 'unpublished' });
	response.render('applications/case-s51/s51-successfully-unpublished');
}
