import { getCase } from './common/services/case.service.js';

/** @typedef {import('../app/auth/auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} ApplicationsLocals
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * Register the non-domain locals for the Applications scope
 *
 * @type {import('express').RequestHandler<*, *, *, *, ApplicationsLocals>}
 */
export const registerLocals = ({ baseUrl }, response, next) => {
	response.locals.serviceName = 'NSIP Applications';
	response.locals.serviceUrl = baseUrl;

	next();
};

/**
 *
 * @param {string[]|null} query
 * @param {boolean} shouldBeDraft
 * @returns {(request: *, response:*, next:*) => void}
 */
export const registerCaseWithQuery = (query, shouldBeDraft = false) => {
	return async (request, response, next) => {
		const { caseId } = response.locals;
		const fullQuery = !query ? null : [...query, 'status'];

		let currentCase;

		try {
			currentCase = caseId
				? await getCase(caseId, fullQuery)
				: { title: '', description: '', status: 'Draft' };
		} catch {
			return throwError(`Failed API request for case ${caseId}`, next);
		}

		const isDraft = currentCase.status === 'Draft';

		if ((isDraft && !shouldBeDraft) || (currentCase.status !== 'Draft' && shouldBeDraft)) {
			return throwError(
				`Trying to load a ${shouldBeDraft ? '' : 'non-'}draft page for a ${
					isDraft ? '' : 'non-'
				}draft case`,
				next
			);
		}

		response.locals.currentCase = currentCase;
		next();
	};
};

// TODO: in case this needs to be used by other locals, move to shared folder
/**
 *
 * @param {string} errorMessage
 * @param {*} next
 * @returns {Promise<void>}
 */
const throwError = (errorMessage, next) => {
	return Promise.resolve()
		.then(() => {
			throw new Error(errorMessage);
		})
		.catch(next);
};
