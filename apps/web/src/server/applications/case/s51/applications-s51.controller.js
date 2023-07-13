/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications-s51.session.js').S51Advice} S51Advice */

import { getSessionS51, setSessionS51 } from './applications-s51.session.js';

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
export async function viewApplicationsCaseS51CreatePage(request, response) {
	const { session, params } = request;
	const values = getSessionS51(session);

	response.render(`applications/case-s51/s51-${params.step}`, { values });
}

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

	const { nextPage } = createS51Journey[params.step];

	response.redirect(`../create/${nextPage}`);
}

/**
 * View the check your answers page for the s51 advice in creation
 *
 * @type {import('@pins/express').RenderHandler<{documentationCategories: DocumentationCategory[]}, {}>}
 */
export async function viewApplicationsCaseS51CheckYourAnswers(_, response) {
	// TODO: to do.
	response.render(`applications/case-s51/s51-check-your-answers`);
}
