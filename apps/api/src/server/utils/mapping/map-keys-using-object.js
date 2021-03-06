import { mapKeys } from "lodash-es";

/**
 * 
 * @param {object} objectToModify 
 * @param {object} keyMap 
 * @returns {object}
 */
export const mapKeysUsingObject = (objectToModify, keyMap) => {
    return mapKeys(objectToModify, (value, key) => {
        return keyMap[key] || key;
    })
}
