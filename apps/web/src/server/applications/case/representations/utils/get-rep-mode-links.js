export const repModeLinkOptions = {
	change: 'change',
	check: 'check',
	summary: 'summary'
};

/**
 * @typedef {Object.<string, string>} repModeLinks
 */

/**
 * @param {repModeLinks} links
 * @param {string} repMode
 * @returns {repModeLinks}
 */
export const getRepModeLinks = (links, repMode) => {
	/** @type {repModeLinks} */
	const changeLinks = {};

	Object.keys(links).forEach((link) => {
		changeLinks[link] = `${links[link]}&repMode=${repMode}`;
	});

	return changeLinks;
};
