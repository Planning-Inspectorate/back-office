import { mapTitles } from './map-titles.js';

/**
 * @typedef {object} Titles
 * @property {string} default
 * @property {string} change
 */

/**
 * @typedef {object} MapTitles
 * @property {string} pageTitle
 * @property {string} pageHeading
 */

/**
 * @param {string|undefined} repMode
 * @param {Titles} titles
 * @returns {MapTitles}
 */
export const getPageTitles = (repMode, titles) => {
	let pageTitles = mapTitles(titles.default, titles.default);

	if (repMode === 'change') pageTitles = mapTitles(titles.change, titles.change);

	return pageTitles;
};
