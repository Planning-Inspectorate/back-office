/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreateBody} ApplicationsS51CreateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51CreatePayload} ApplicationsS51CreatePayload */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications-s51.types.js').S51AdviceForm} S51AdviceForm */
/** @typedef {import('../../applications.types.js').S51Advice} S51Advice */
/** @typedef {import('../../applications.types.js').PaginatedResponse<S51Advice>} S51AdvicePaginatedResponse */
/** @typedef {import('express-session').Session & { s51?: Partial<S51Advice> }} SessionWithS51 */

import { dateString } from '../../../lib/nunjucks-filters/date.js';
import { getSessionS51, setSessionS51 } from './applications-s51.session.js';
import { createS51Advice, getS51Advice, getS51FilesInFolder } from './applications-s51.service.js';
import { paginationParams } from '../../../lib/pagination-params.js';
import pino from '../../../lib/logger.js';
import {
	destroySuccessBanner,
	getSuccessBanner,
	setSuccessBanner
} from '../../common/services/session.service.js';

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
 * Show pages for creating/editing s51 advice
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {size?: string, number?: string}, {}>}
 */
export async function viewApplicationsCaseS51Folder(request, response) {
	const number = Number(request.query.number || '1');
	const size = (() => {
		const _size = Number(request.query?.size ?? NaN);
		if (Number.isNaN(_size)) {
			return 50;
		}

		return _size;
	})();

	const s51Files = await (async () => {
		try {
			return await getS51FilesInFolder(response.locals.caseId, size, number);
		} catch (/** @type {*} */ error) {
			pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

			return null;
		}
	})();

	const pagination = s51Files ? paginationParams(size, number, s51Files.pageCount) : null;

	response.render(`applications/components/folder/folder`, {
		items: s51Files,
		pagination
	});
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
 * Show s51 advice item
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {success: string}, {adviceId: string}>}
 */
export async function viewApplicationsCaseS51Upload({ params }, response) {
	const { adviceId } = params;
	const { caseId } = response.locals;

	const s51Advice = await getS51Advice(caseId, Number(adviceId));

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
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51AdviceForm> | null, errors: ValidationErrors}, {}, Partial<S51AdviceForm>, {}, {step: string}, {}>}
 */
export async function updateApplicationsCaseS51CreatePage(request, response) {
	const { errors, body, session, params } = request;

	if (errors) {
		return response.render(`applications/case-s51/s51-${params.step}`, {
			values: body,
			errors
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
 * Success banner after creating S41 advice
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsS51CreateBody, {}, {action: string}>}
 */
export async function viewSuccessfullyS51Created(request, response) {
	// action can be 'edited', 'published', 'created'

	response.render('applications/case-s51/s51-successfully-created.njk', {
		action: request.params.action
	});
}
