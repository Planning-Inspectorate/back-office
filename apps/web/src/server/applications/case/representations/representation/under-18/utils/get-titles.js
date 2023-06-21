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
export const getTitles = (repMode) => {
	let titles = mapTitles('Under 18', 'Under 18');

	if (repMode === 'change')
		titles = mapTitles('Change representation age', 'Change representation age');

	return titles;
};
