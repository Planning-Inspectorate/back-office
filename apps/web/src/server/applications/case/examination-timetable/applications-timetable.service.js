import { get, patch, post, deleteRequest } from '../../../lib/request.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetablePayload} ApplicationsTimetablePayload */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetable} ApplicationsTimetable */
/** @typedef {import('./applications-timetable.types.js').ApplicationExaminationTimetable} ApplicationExaminationTimetable */
/** @typedef {import('./applications-timetable.types.js').ApplicationExaminationTimetableItem} ApplicationExaminationTimetableItem */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * Get the timetable item types
 *
 * @returns {Promise<{id:number, name: string, templateType: string, displayNameEn: string, displayNameCy: string}[]>}
 */
export const getCaseTimetableItemTypes = async () => {
	return get(`applications/examination-timetable-type`);
};

/**
 * Save new timetable item
 *
 * @param {ApplicationsTimetablePayload} payload
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: ValidationErrors}>}
 */
export const createCaseTimetableItem = async (payload) => {
	let response;

	try {
		const updatedTimetable = await post('applications/examination-timetable-items', {
			json: payload
		});
		response = { updatedTimetable };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Updates an existing timetable item
 *
 * @param {ApplicationsTimetablePayload} payload
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: ValidationErrors}>}
 */
export const updateCaseTimetableItem = async (payload) => {
	let response;
	try {
		const updatedTimetable = await patch(`applications/examination-timetable-items/${payload.id}`, {
			json: payload
		});
		response = { updatedTimetable };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Get case timetable items
 * @param {number} caseId
 * @returns {Promise<ApplicationExaminationTimetable>}
 */
export const getCaseTimetableItems = async (caseId) => {
	return get(`applications/examination-timetable-items/case/${caseId}`);
};

/**
 * Get one timetable item by its id
 * @param {number} timetableId
 * @returns {Promise<ApplicationExaminationTimetableItem>}
 */
export const getCaseTimetableItemById = async (timetableId) => {
	return get(`applications/examination-timetable-items/${timetableId}`);
};

/**
 * Return Timetable Item Type by its name
 *
 * @param {string} selectedItemTypeName
 * @returns {Promise<{name: string, templateType: string, id: number}>}
 */
export const getCaseTimetableItemTypeByName = async (selectedItemTypeName) => {
	const timetableItemTypes = await getCaseTimetableItemTypes();

	const selectedItemType =
		timetableItemTypes.find((itemType) => itemType.name === selectedItemTypeName) ||
		timetableItemTypes[0];

	return {
		name: selectedItemType.name || '',
		templateType: selectedItemType.templateType,
		id: selectedItemType.id
	};
};

/**
 * Publish case timetable items
 * @param {number} caseId
 * @returns {Promise<{publishedItems: ApplicationsTimetable[], errors?: ValidationErrors}>}
 */
export const publishCaseTimetableItems = async (caseId) => {
	let response;
	try {
		response = await patch(`applications/examination-timetable-items/publish/${caseId}`, {});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({
				errors: { msg: 'There was an issue and the timetable could not be published, try again' }
			});
		});
	}

	return response;
};

/**
 * Unpublish case timetable items
 * @param {number} caseId
 * @returns {Promise<{publishedItems: ApplicationsTimetable[], errors?: ValidationErrors}>}
 */
export const unpublishCaseTimetableItems = async (caseId) => {
	let response;
	try {
		response = await patch(`applications/examination-timetable-items/unpublish/${caseId}`, {});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({
				errors: { msg: 'There was an issue and the timetable could not be unpublished, try again' }
			});
		});
	}

	return response;
};

/**
 * Delete single timetable item
 * @param {number} timetableId
 * @returns {Promise<{updatedTimetable?: ApplicationsTimetable, errors?: ValidationErrors}>}
 */
export const deleteCaseTimetableItem = async (timetableId) => {
	let response;
	try {
		response = await deleteRequest(`applications/examination-timetable-items/${timetableId}`);
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
