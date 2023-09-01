/**
 * @param {string} stringA
 * @param {string} stringB
 * @returns {boolean}
 */
const checkStringsMatch = (stringA, stringB) =>
	String(stringA).toLowerCase() === String(stringB).toLowerCase();

export default checkStringsMatch;
