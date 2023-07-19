/**
 * @typedef {Object} IdNamePair
 * @property {number} id
 * @property {string} name
 */

/**
 * Searches the provided array of IdNamePairs for an entry with the provided name, and returns the id if a match was found, otherwise returns undefined
 *
 * @param {IdNamePair[]} idNamePairs
 * @param {string} name
 * @returns {number|undefined}
 */
export const getIdByNameFromIdNamePairs = (idNamePairs, name) =>
	idNamePairs.find((idNamePair) => idNamePair.name.toLowerCase() === name)?.id;
