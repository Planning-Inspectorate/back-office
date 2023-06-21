import { mapTitles } from '../../utils/map-titles.js';

/**
 * @typedef {object} MapTitles
 * @property {string} pageTitle
 * @property {string} pageHeading
 */

/**
 * @param {string|undefined} repMode
 * @returns {MapTitles}
 */
const getRepresentedTitles = (repMode) => {
	let representedTitles = mapTitles('Contact details', 'Contact details');

	if (repMode === 'change')
		representedTitles = mapTitles('Change contact details', 'Change contact details');

	return representedTitles;
};

/**
 * @param {string|undefined} repMode
 * @returns {MapTitles}
 */
const getRepresentativeTitles = (repMode) => {
	let representativeTitles = mapTitles('Add agent contact details', 'Add agent contact details');

	if (repMode === 'change')
		representativeTitles = mapTitles('Change agent details', 'Change agent details');

	return representativeTitles;
};

/**
 * @param {string|undefined} repType
 * @param {string|undefined} repMode
 * @returns {MapTitles}
 */
export const getTitles = (repType, repMode) => {
	let titles = mapTitles('', '');

	if (repType === 'represented') titles = getRepresentedTitles(repMode);
	else if (repType === 'representative') titles = getRepresentativeTitles(repMode);

	return titles;
};
