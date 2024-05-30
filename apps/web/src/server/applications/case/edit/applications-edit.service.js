/**
 * Given a list of possible fields, returns the first it encounters in the body object.
 * Throws if none of the options are found.
 *
 * @param {Record<string, unknown>} body
 * @param {string[]} fields
 * @returns {string}
 * @throws {Error}
 * */
export const getUpdatedField = (body, fields) => {
	for (const field of fields) {
		if (Object.prototype.hasOwnProperty.call(body, field)) {
			return field;
		}
	}

	throw new Error(`Request body does not contain any of the properties: ${fields.join(', ')}`);
};
