import capitalizeString from './capitalizeString.js';

/**
 * Capitalize all words for the display address
 *
 * @param {string} rawAddress
 * @returns {string}
 */
export default (rawAddress) => {
	// additional info, number, road, town, postcode
	const addressParts = rawAddress.split(', ');

	let formattedAddress = addressParts.slice(0, -1).reduce((previousParts, currentPart) => {
		return `${previousParts}${capitalizeString(currentPart).slice(0, -1)}, `;
	}, '');
	formattedAddress += addressParts[addressParts.length - 1];

	return formattedAddress;
};
