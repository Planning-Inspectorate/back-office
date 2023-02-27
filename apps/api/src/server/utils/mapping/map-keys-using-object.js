import { mapKeys } from 'lodash-es';

/**
 *
 * @param {object | undefined} objectToModify
 * @param {Record<string, any>} keyMap
 * @returns {object | undefined}
 */
export const mapKeysUsingObject = (objectToModify, keyMap) => {
	return mapKeys(objectToModify, (value, key) => {
		return keyMap[key] || key;
	});
};
