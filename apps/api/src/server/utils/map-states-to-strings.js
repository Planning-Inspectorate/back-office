import { mapValues } from 'lodash-es';

/**
 *
 * @param {object} object
 * @returns {object}
 */
const mapObjectKeysToStrings = (object) => {
	return mapValues(object, (_value, key) => {
		return key;
	});
};

export default mapObjectKeysToStrings;
