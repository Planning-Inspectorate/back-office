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
	let representedTitles = mapTitles('Preferred contact method', 'Preferred contact method');

	if (repMode === 'change')
		representedTitles = mapTitles('Change contact method', 'Change contact method');

	return representedTitles;
};

/**
 * @param {string|undefined} repMode
 * @returns {MapTitles}
 */
const getRepresentativeTitles = (repMode) => {
	let representativeTitles = mapTitles('Preferred contact method', 'Preferred contact method');

	if (repMode === 'change')
		representativeTitles = mapTitles('Edit agent contact method', 'Edit agent contact method');

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
