// Import request: this formats requests to the api
import { get, patch, post } from '../../src/server/lib/request.js';

/** @typedef {import('./example.types').Example} Example */
/**
 * @returns {Promise<Array<Example>>} TODO: change Example to dataType returned by Promise
 */
export function getAllExample() {
	// TODO: replace apiUrl with api to call;
	const apiUrl = '';

	return get(apiUrl);
}

/**
 *
 * @param {string | number} id
 * @returns {Promise<Example>} TODO: change Example to dataType returned by Promise
 */
export function getExampleById(id) {
	// TODO: replace apiUrl with api to call;
	const apiUrl = '';

	return get(`${apiUrl}/${id}`);
}

// Question: Not sure about the any exampleData datatype. But setting to anything else give datatype error in controller
/**
 *
 * @param {any} exampleData
 * @returns {Promise<Example>} TODO: change Example to dataType returned by Promise
 */
export function setExample(exampleData) {
	// TODO: replace apiUrl with api to call;
	const apiUrl = '';

	return post(`${apiUrl}`, { json: { ...exampleData } });
}

// Question: Not sure about the any updatedExampleData datatype. But setting to anything else give datatype error in controller
/**
 *
 * @param {string | number} id
 * @param {any} updatedExampleData
 * @returns {Promise<Example>} TODO: change Example to dataType returned by Promise
 */
export function updateExampleById(id, updatedExampleData) {
	// TODO: replace apiUrl with api to call;
	const apiUrl = '';

	return patch(`${apiUrl}/${id}`, { json: { ...updatedExampleData } });
}
