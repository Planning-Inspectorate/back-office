import { getRepModeLinks, repModeLinkOptions } from '../../utils/get-rep-mode-links.js';

/**
 * @param {object|*} representation
 * @return {object}
 */
export const getRepModePageURLs = ({ status, pageURLs }) =>
	status === 'DRAFT'
		? getRepModeLinks(pageURLs, repModeLinkOptions.check)
		: getRepModeLinks(pageURLs, repModeLinkOptions.change);
