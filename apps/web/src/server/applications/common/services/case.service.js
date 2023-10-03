import pino from '../../../lib/logger.js';
import { get, patch, post } from '../../../lib/request.js';
import {
	destroySessionApplicantInfoTypes,
	destroySessionCaseSectorName,
	setSessionCaseHasNeverBeenResumed
} from './session.service.js';

/**
 * @typedef {import('../../applications.types').Case} Case
 * @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 * @typedef {import('@pins/express').ValidationErrors} ValidationErrors
 */

/**
 * Get draft case by id
 * optional query parameters can filter the returned data
 *
 * @param {number} id
 * @param { string[] | null} query
 * @returns {Promise<Case>}
 */
export const getCase = async (id, query = null) => {
	const queryObject = query?.reduce((acc, q) => ({ ...acc, [q]: true }), {}) ?? {};
	const queryStringified = JSON.stringify(queryObject);

	try {
		return await get(`applications/${id}${query ? `?query=${queryStringified}` : ''}`);
	} catch (/** @type {*} */ error) {
		pino.error(
			`[WEB] GET /applications-service/case/${id} (Response code: ${error?.response?.statusCode})`
		);
		throw new Error(error?.response?.statusCode ?? 500);
	}
};

/**
 * Create new draft case and return id and applicant ids
 *
 * @param {Record<string, *>} payload
 * @param {SessionWithCaseSectorName} session
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createCase = async (payload, session) => {
	const payloadWithEmptyApplicant = { ...payload, applicants: [{ organisationName: '' }] };

	try {
		setSessionCaseHasNeverBeenResumed(session);
		destroySessionApplicantInfoTypes(session);
		destroySessionCaseSectorName(session);

		return await post('applications', {
			json: payloadWithEmptyApplicant
		});
	} catch (/** @type {*} */ error) {
		return { errors: error?.response?.body?.errors || {} };
	}
};

/**
 *
 * Update case and return id and applicant ids if success or errors if fail
 *
 * @param {string} caseId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateCase = async (caseId, payload) => {
	try {
		return await patch(`applications/${caseId}`, {
			json: payload
		});
	} catch (/** @type {*} */ error) {
		const apiErrors = error?.response?.body?.errors;
		if (typeof apiErrors === 'object' && typeof Object.values(apiErrors)[0] === 'string') {
			return { errors: error?.response?.body?.errors || {} };
		}

		return { errors: {} };
	}
};

/**
 *
 * Publish case with updated changes
 *
 * @param {number} caseId
 * @returns {Promise<{publishedDate?: number, errors?: ValidationErrors}>}
 */
export const publishCase = async (caseId) => {
	try {
		return await patch(`applications/${caseId}/publish`);
	} catch (/** @type {*} */ error) {
		return { errors: error?.response?.body?.errors || {} };
	}
};

/**
 *
 * Unublish case
 *
 * @param {number} caseId
 * @returns {Promise<{caseId?: number, errors?: ValidationErrors}>}
 */
export const unpublishCase = async (caseId) => {
	try {
		return await patch(`applications/${caseId}/unpublish`);
	} catch (/** @type {*} */ error) {
		return { errors: error?.response?.body?.errors || null };
	}
};
