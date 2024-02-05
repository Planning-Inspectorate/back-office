import { post } from '../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Move draft caseto pre-application
 *
 * @param {number} id
 * @returns {Promise<{id?: number, applicantId?: number, errors?: ValidationErrors}>}
 */
export const moveStateToPreApplication = async (id) => {
	try {
		return await post(`applications/${id}/start`);
	} catch (/** @type {*} */ error) {
		return new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}
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
			errorMessage = 'Choose at least one region';
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
