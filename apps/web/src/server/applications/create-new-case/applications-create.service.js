import { post } from '../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Move draft caseto pre-application
 *
 * @param {number} id
 * @returns {Promise<{id?: number, applicantId?: number, errors?: ValidationErrors}>}
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
	switch (fieldName) {
		case 'gridReferenceEasting':
			return 'Enter the Grid reference Easting';
		case 'gridReferenceNorthing':
			return 'Enter the Grid reference Northing';
		case 'projectLocation':
			return 'Enter the project location';
		case 'projectLocationWelsh':
			return 'Enter the project location in Welsh';
		case 'regions':
			return 'Choose at least one region';
		case 'sector':
			return 'Choose the sector of the project';
		case 'subSector':
			return 'Choose the subsector of the project';
		default:
			return existingError ? existingError.toString() : 'Unknown Error';
	}
};
