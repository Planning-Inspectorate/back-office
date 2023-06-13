/**
 * @typedef {object} Address
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} postcode
 * @property {string} country
 */

/**
 * @param {Address} address
 * @returns {object}
 */
export const formatAddress = ({ addressLine1, addressLine2, town, postcode, country }) => ({
	address: {
		addressLine1,
		addressLine2,
		town,
		postcode,
		country
	}
});
