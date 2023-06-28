/**
 * @typedef {Object.<string, string>} ChangeLinks
 */

/**
 * @param {ChangeLinks} links
 * @returns {ChangeLinks}
 */
export const getChangeLinks = (links) => {
	/** @type {ChangeLinks} */
	const changeLinks = {};

	Object.keys(links).forEach((link) => {
		changeLinks[link] = `${links[link]}&repMode=change`;
	});

	return changeLinks;
};
