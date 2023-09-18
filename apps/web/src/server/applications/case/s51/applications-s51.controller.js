/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreateBody} ApplicationsS51CreateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51UpdatePayload */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdateBody} ApplicationsS51UpdateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51ChangeStatusBody} ApplicationsS51ChangeStatusBody */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications-s51.types.js').S51AdviceForm} S51AdviceForm */
/** @typedef {import('../../applications.types.js').S51Advice} S51Advice */
/** @typedef {import('../../applications.types.js').PaginatedResponse<S51Advice>} S51AdvicePaginatedResponse */
/** @typedef {import('express-session').Session & { s51?: Partial<S51Advice> }} SessionWithS51 */

import { dateString } from '../../../lib/nunjucks-filters/date.js';
import { getSessionS51, setSessionS51 } from './applications-s51.session.js';
import {
	checkS51NameIsUnique,
	createS51Advice,
	getS51Advice,
	getS51FilesInFolder,
	mapS51AdviceToPage,
	mapUpdateBodyToPayload,
	updateS51Advice,
	updateS51AdviceStatus,
	getS51AdviceReadyToPublish,
	removeS51AdviceFromReadyToPublish,
	publishS51AdviceItems
} from './applications-s51.service.js';
import { paginationParams } from '../../../lib/pagination-params.js';
import {
	destroySuccessBanner,
	getSuccessBanner,
	setSuccessBanner
} from '../../common/services/session.service.js';
import { deleteCaseDocumentationFile } from '../documentation/applications-documentation.service.js';

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

	const properties = await s51FolderData(query, caseId);

	response.render(`applications/components/folder/folder`, properties);
}

/**
 * Show s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {adviceId: string}>}
 */
export async function viewApplicationsCaseS51Item({ params, session }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, Number(adviceId));

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

	const { errors: apiErrors } = await updateS51Advice(caseId, +adviceId, payload);

	if (apiErrors) {
		return response.render(`applications/case-s51/properties/edit/s51-edit-${step}`, {
			adviceId,
			errors: apiErrors
		});
	}

	return response.redirect('../properties');
}

/**
 * Show s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51ChangeStatusBody, {size?: string, number?: string}>}
 */
export async function changeAdviceStatus({ query, errors: validationErrors, body }, response) {
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
		const s51Items = await s51FolderData(query, caseId);

		return response.render(`applications/components/folder/folder`, {
			errors: validationErrors || apiErrors,
			...s51Items
		});
	}

	response.redirect('.');
}

/**
 * Show s51 advice item
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
 * Refines the S51Advice data to display on the check your answers page
 *
 * @param { Partial<S51AdviceForm> | null } data
 */
const getCheckYourAnswersRows = (data) => {
	if (!data) return {};

	const enquiryDateString = [
		data['enquiryDate.year'],
		data['enquiryDate.month'],
		data['enquiryDate.day']
	].join('-');
	const enquiryDate = new Date(enquiryDateString).toISOString();

	const adviceDateString = [
		data['adviceDate.year'],
		data['adviceDate.month'],
		data['adviceDate.day']
	].join('-');
	const adviceDate = new Date(adviceDateString).toISOString();
	const enquirerLabel = `${data?.enquirerFirstName} ${data?.enquirerLastName}${
		(data?.enquirerFirstName || data?.enquirerLastName) && data?.enquirerOrganisation ? ', ' : ''
	}${data?.enquirerOrganisation}`;

	return {
		title: data.title,
		enquirer: data.enquirerOrganisation,
		enquirerLabel,
		firstName: data.enquirerFirstName,
		lastName: data.enquirerLastName,
		enquiryMethod: data.enquiryMethod,
		enquiryDateDisplay: dateString(
			data['enquiryDate.year'],
			data['enquiryDate.month'],
			data['enquiryDate.day']
		),
		enquiryDate: enquiryDate,
		enquiryDetails: data.enquiryDetails,
		adviser: data.adviser,
		adviceDateDisplay: dateString(
			data['adviceDate.year'],
			data['adviceDate.month'],
			data['adviceDate.day']
		),
		adviceDate: adviceDate,
		adviceDetails: data.adviceDetails
	};
};

/**
 * Save data for creating/editing s51 advice
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
 * View page for deleting S51 attachment
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {adviceId: string, attachmentId: string}>}
 */
export async function viewApplicationsCaseS51Delete({ params }, response) {
	const { adviceId, attachmentId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, +adviceId);
	const attachmentToDelete = s51Advice.attachments.find(
		(attachment) => attachment.documentGuid === attachmentId
	);

	response.render('applications/case-s51/s51-delete.njk', {
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
	const properties = await getDataForPublishingQueuePage(caseId, query.number, query.size);

	response.render(`applications/case-s51/s51-publishing-queue`, properties);
}

/**
 * Publish S51 advice items
 *
 * @type {import('@pins/express').RenderHandler<{}, any, {selectAll?: boolean, selectedFilesIds: string[]}, {size?: string, number?: string}, {}>}
 * */
export async function publishApplicationsCaseS51Items({ query, body }, response) {
	const { caseId } = response.locals;
	await publishS51AdviceItems(caseId, {
		publishAll: Boolean(body.selectAll),
		ids: body.selectedFilesIds
	});

	const properties = await getDataForPublishingQueuePage(caseId, query.number, query.size);

	response.render(`applications/case-s51/s51-publishing-queue`, properties);
}

/**
 * Remove s51 item from the publishing queue
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {adviceId: string}>}
 */
export async function removeApplicationsCaseS51AdviceFromPublishingQueue({ params }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const { errors } = await removeS51AdviceFromReadyToPublish(caseId, +adviceId);

	if (errors) {
		const properties = await getDataForPublishingQueuePage(caseId);
		return response.render(`applications/case-s51/s51-publishing-queue`, {
			...properties,
			errors
		});
	}

	return response.redirect('../../');
}

/**
 *
 * @param {number} caseId
 * @param {string=} queryPageNumber
 * @param {string=} queryPageSize
 * @returns
 */
const getDataForPublishingQueuePage = async (caseId, queryPageNumber, queryPageSize) => {
	const pageNumber = Number.parseInt(queryPageNumber || '1', 10);
	const pageSize = Number.parseInt(queryPageSize || '25', 10);
	const s51Advices = await getS51AdviceReadyToPublish(caseId, pageNumber, pageSize);

	const paginationButtons = getPaginationButtonData(pageNumber, s51Advices.pageCount);

	return {
		s51Advices,
		paginationButtons,
		pageSize
	};
};

/**
 *
 * @param {number} currentPageNumber
 * @param {number} pageCount
 * @returns {any}
 */
const getPaginationButtonData = (currentPageNumber, pageCount) => {
	return {
		...(currentPageNumber === 1 ? {} : { previous: { href: `?number=${currentPageNumber - 1}` } }),
		...(currentPageNumber === pageCount
			? {}
			: { next: { href: `?number=${currentPageNumber + 1}` } }),
		items: [...Array.from({ length: pageCount }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}`,
			current: index + 1 === currentPageNumber
		}))
	};
};

/**
 *
 *
 * @param {{number?: string, size?: string}} requestQuery
 * @param {number} caseId
 * @returns {Promise<{items: S51AdvicePaginatedResponse, pagination: any}>}
 */
const s51FolderData = async (requestQuery, caseId) => {
	const pageNumber = Number(requestQuery.number || '1');
	const querySize = Number(requestQuery?.size ?? NaN);
	const pageSize = !Number.isNaN(querySize) ? querySize : 50;

	const s51Files = await getS51FilesInFolder(caseId, pageSize, pageNumber);

	const pagination = s51Files ? paginationParams(pageSize, pageNumber, s51Files.pageCount) : null;

	return {
		items: s51Files,
		pagination
	};
};
