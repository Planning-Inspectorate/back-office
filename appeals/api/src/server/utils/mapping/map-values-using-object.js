import { mapValues } from 'lodash-es';

/**
 *
 * @param {object | undefined} objectToModify
 * @param {object} valueMap
 * @returns {object}
 */
export const mapValuesUsingObject = (objectToModify, valueMap) => {
	return mapValues(objectToModify, (value, key) => {
		const callback = valueMap[key];

		return callback ? callback(value) : value;
	});
};
