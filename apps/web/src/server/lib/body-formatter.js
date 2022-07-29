/**
 * Transform an object shaped like:
 * {
 *   'A1.B1.C1': 'v1',
 *   'A1.B1.C2': 'v2',
 *   'A1.B2.C3': 'v3'
 * }
 * in an object shaped like
 * {
 * 	A1: {
 * 		B1: {
 * 			C1: 'v1'
 * 			C2: 'v2'
 * 		},
 * 		B2: {
 * 		 C3: 'v3'
 * 		}
 * 	}
 * }
 *
 * @param {Record<string, string|undefined>} body
 * @returns {Record<string, *>}
 */
export const bodyToPayload = (body) => {
	/** @type {Record<string, *>} */ let payload = {};

	const fieldsKeys = Object.keys(body);

	for (const fieldKey of fieldsKeys) {
		const keys = fieldKey.split('.');
		const fieldDepth = keys.length;

		switch (fieldDepth) {
			case 3:
				payload = { ...payload };
				payload[keys[0]] = { ...payload[keys[0]] };
				payload[keys[0]][keys[1]] = { ...payload[keys[0]][keys[1]] };
				payload[keys[0]][keys[1]][keys[2]] = body[fieldKey] || '';
				break;
			case 2:
				payload = { ...payload };
				payload[keys[0]] = { ...payload[keys[0]] };
				payload[keys[0]][keys[1]] = body[fieldKey] || '';
				break;
			default:
				// case 1
				payload = { ...payload };
				payload[keys[0]] = body[fieldKey] || '';

				break;
		}
	}

	return payload;
};
