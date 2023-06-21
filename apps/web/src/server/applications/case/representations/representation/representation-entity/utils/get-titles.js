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
	let titles = mapTitles('Representation entity', 'Representation entity');

	if (repMode === 'change')
		titles = mapTitles('Change representation entity', 'Change representation entity');

	return titles;
};
