import { get, patch, post } from '../../../lib/request.js';
import { destroySessionApplicantInfoTypes } from './applicant/applications-create-applicant-session.service.js';
import {
	destroySessionCaseSectorName,
	setSessionCaseHasNeverBeenResumed
} from './case/applications-create-case-session.service.js';

/** @typedef {import('./case/applications-create-case-session.service.js').SessionWithCaseSectorName} SessionWithCaseSectorName */
/** @typedef {import('../../applications.types.js').Application} Application */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 *
 * Update application draft and return id and applicant ids if success or errors if fail
 *
 * @param {string} applicationId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateApplicationDraft = async (applicationId, payload) => {
	let response;

	try {
		response = await patch(`applications/${applicationId}`, {
			json: payload
		});
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			const apiErrors = error?.response?.body?.errors;

			if (typeof apiErrors === 'object' && typeof Object.values(apiErrors)[0] === 'string') {
				resolve({ errors: error?.response?.body?.errors || {} });
			} else {
				resolve({ errors: {} });
			}
		});
	}

	return response;
};

/**
 * Create new draft application and return id and applicant ids
 *
 * @param {Record<string, *>} payload
 * @param {SessionWithCaseSectorName} session
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createApplicationDraft = async (payload, session) => {
	const payloadWithEmptyApplicant = { ...payload, applicants: [{ organisationName: '' }] };

	let response;

	try {
		response = await post('applications', {
			json: payloadWithEmptyApplicant
		});
		setSessionCaseHasNeverBeenResumed(session);
		destroySessionApplicantInfoTypes(session);
		destroySessionCaseSectorName(session);
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}

	return response;
};

/**
 * Get draft application by id
 * optional query parameters can filter the returned data
 *
 * @param {number} id
 * @param { string[] | null} query
 * @returns {Promise<Application>}
 */
export const getApplicationDraft = async (id, query = null) => {
	let queryObject = {};

	if (query) {
		for (const singleQuery of query) {
			queryObject = { ...queryObject, [singleQuery]: true };
		}
	}

	const queryStringified = JSON.stringify(queryObject);

	return get(`applications/${id}${query ? `?query=${queryStringified}` : ''}`);
};

/**
 * Move draft application to pre-application
 *
 * @param {number} id
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const moveStateToPreApplication = async (id) => {
	let response;

	try {
		response = await post(`applications/${id}/start`);
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}

	return response;
};

/**
 * returns a user-friendly error message for a particular case field.
 * Used by the check your answers page, and each of the draft case create pages.
 * returns the exising error message if key not found
 *
 * @param {string} fieldName
 * @param {import('@pins/express').ValidationError | null} [existingError=null]
 * @returns {string}
 */
export const getErrorMessageCaseCreate = (fieldName, existingError = null) => {
	let errorMessage = 'Unknown Error';

	switch (fieldName) {
		case 'gridReferenceEasting':
			errorMessage = 'Enter the Grid reference Easting';
			break;
		case 'gridReferenceNorthing':
			errorMessage = 'Enter the Grid reference Northing';
			break;
		case 'projectLocation':
			errorMessage = 'Enter the project location';
			break;
		case 'regions':
			errorMessage = 'Choose one or multiple regions';
			break;
		case 'sector':
			errorMessage = 'Choose the sector of the project';
			break;
		case 'subSector':
			errorMessage = 'Choose the subsector of the project';
			break;
		default:
			errorMessage = existingError ? existingError.toString() : 'Unknown Error';
	}
	return errorMessage;
};
