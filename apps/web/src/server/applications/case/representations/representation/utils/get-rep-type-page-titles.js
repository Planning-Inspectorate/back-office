import { getPageTitles } from './get-page-titles.js';
import { mapTitles } from './map-titles.js';

/**
 * @typedef {object} MapTitles
 * @property {string} pageTitle
 * @property {string} pageHeading
 */

/**
 * @typedef {object} Titles
 * @property {TitleTypes} represented
 * @property {TitleTypes} representative
 */

/**
 * @typedef {object} TitleTypes
 * @property {string} default
 * @property {string} change
 */

/**
 * @param {string|undefined} repType
 * @param {string|undefined} repMode
 * @param {Titles} titles
 * @returns {MapTitles}
 */
export const getRepTypePageTitles = (repType, repMode, titles) => {
	let repTypePageTitles = mapTitles('', '');

	if (repType === 'represented') repTypePageTitles = getPageTitles(repMode, titles.represented);
	else if (repType === 'representative')
		repTypePageTitles = getPageTitles(repMode, titles.representative);

	return repTypePageTitles;
};
