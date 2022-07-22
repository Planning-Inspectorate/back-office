/**
 * Create the application with name and description
 *
 * @param {Record<*, string>} body
 * @returns {object}
 */
export const bodyToValues = (body) => {
	/** @type {Record<*, string>} */ const values = {};
	const bodyKeys = Object.keys(body);

	for (const key of bodyKeys) {
		values[key] = body[key];
	}

	return values;
};

/**
 * Create the application with name and description
 *
 * @param {Record<*, string>} body
 * @returns {Record<string, string>}
 */
export const bodyToPayload = (body) => {
	/** @type {Record<*, *>} */ let payload = {};

	const fieldsKeys = Object.keys(body);

	for (const fieldKey of fieldsKeys) {
		const keys = fieldKey.split('.');
		const fieldDepth = keys.length;

		switch (fieldDepth) {
			case 2:
				payload = { ...payload };
				payload[keys[0]] = { ...payload[keys[0]] };
				payload[keys[0]][keys[1]] = body[fieldKey];
				break;
			case 3:
				payload = { ...payload };
				payload[keys[0]] = { ...payload[keys[0]] };
				payload[keys[0]][keys[1]] = { ...payload[keys[0]][keys[1]] };
				payload[keys[0]][keys[1]][keys[2]] = body[fieldKey];
				break;
			default:
				payload = { ...payload };
				payload[keys[0]] = body[fieldKey];

				break;
		}
	}

	return payload;
};
