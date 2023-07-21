/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications-s51.session.js').S51Advice} S51Advice */
/** @typedef {import('express-session').Session & { s51?: Partial<S51Advice> }} SessionWithS51 */

import { dateString } from '../../../lib/nunjucks-filters/date.js';
import { getSessionS51, setSessionS51 } from './applications-s51.session.js';
import {
	getSessionApplicationsReferBackTo,
	setSessionApplicationsReferBackTo,
	destroySessionApplicationsReferBackTo
} from '../../applications-session.service.js';

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
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51Advice> | null}, {}, {}, {}, {step: string}>}
 */
export async function viewApplicationsCaseS51Folder(request, response) {
	destroySessionApplicationsReferBackTo(request.session);

	response.render(`applications/case-documentation/folder/documentation-folder`);
}

/**
 * Show pages for creating/editing s51 advice
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51Advice> | null}, {}, {}, {}, {step: string}>}
 */
export async function viewApplicationsCaseS51CreatePage(request, response) {
	const { session, params } = request;
	const values = getSessionS51(session);

	response.render(`applications/case-s51/s51-${params.step}`, { values });
}

/**
 * Refines the S51Advice data to display on the check your answers page
 *
 * @param { Partial<S51Advice> | null } data
 */
const getCheckYourAnswersRows = (data) => {
	if (!data) return {};

	return {
		title: data.title,
		enquirer: data.enquirerOrganisation,
		enquiryMethod: data.enquiryMethod,
		enquiryDate: dateString(
			data['enquiryDate.year'],
			data['enquiryDate.month'],
			data['enquiryDate.day']
		),
		enquiryDetails: data.enquiryDetails,
		adviser: data.adviser,
		adviseDate: dateString(
			data['adviceDate.year'],
			data['adviceDate.month'],
			data['adviceDate.day']
		),
		adviceDetails: data.adviceDetails
	};
};

/**
 * Save data for creating/editing s51 advice
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51Advice> | null, errors: ValidationErrors}, {}, Partial<S51Advice>, {}, {step: string}, {}>}
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
	const redirectBackTo = getSessionApplicationsReferBackTo(session);

	if (redirectBackTo) {
		response.redirect(redirectBackTo);
	} else {
		const { nextPage } = createS51Journey[params.step];
		response.redirect(`../create/${nextPage}`);
	}
}

/**
 * S51 advice - check your answers page
 *
 * @type {import('@pins/express').RenderHandler<{values: Partial<S51Advice> | null, documentationCategory: {id: string, displayNameEn: string}}, {}, {}, {}, {folderId: string}>}
 */
export async function viewApplicationsCaseS51CheckYourAnswers(request, response) {
	const { session, params } = request;

	const s51Data = getSessionS51(session);
	setSessionApplicationsReferBackTo(session, 'check-your-answers');

	response.render(`applications/case-s51/s51-check-your-answers`, {
		values: getCheckYourAnswersRows(s51Data),
		documentationCategory: {
			id: params.folderId,
			displayNameEn: 's51-advice'
		}
	});
}
