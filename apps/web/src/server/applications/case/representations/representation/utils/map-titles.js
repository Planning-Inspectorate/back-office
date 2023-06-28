/**
 * @typedef {object} MapTitles
 * @property {string} pageTitle
 * @property {string} pageHeading
 */

/**
 * @param {string} pageTitle
 * @param {string} pageHeading
 * @returns {MapTitles}
 */
export const mapTitles = (pageTitle, pageHeading) => {
	return {
		pageTitle,
		pageHeading
	};
};
