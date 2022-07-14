import { mapKeys } from 'lodash-es';

/**
 *
 * @param {object | undefined} objectToModify
 * @param {object} keyMap
 * @returns {object | undefined}
 */
export const mapKeysUsingObject = (objectToModify, keyMap) => {
	return mapKeys(objectToModify, (value, key) => {
		return keyMap[key] || key;
	});
};
