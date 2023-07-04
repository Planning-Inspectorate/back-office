import { getRepModeLinks, repModeLinkOptions } from '../../utils/get-rep-mode-links.js';
import { getRepresentationBaseUrl } from '../utils/get-representation-page-urls.js';
import { getSelectedOptionsText } from '../utils/get-selected-options-text.js';

/**
 * @typedef {object|*} Locals
 * @property {object} representation
 */

/**
 * @param {string} repMode
 * @param {string} caseId
 * @param {object|*} pageLinks
 * @returns {string}
 */
const getBackLinkUrl = (repMode, caseId, pageLinks) =>
	repMode === repModeLinkOptions.summary ? getRepresentationBaseUrl(caseId) : pageLinks.backLinkUrl;

/**
 * @param {object|*} query
 * @param {object|*} params
 * @param {Locals} locals
 * @returns {object}
 */
export const getCheckAnswersViewModel = ({ repMode }, { caseId }, { representation }) => {
	return {
		...getSelectedOptionsText(representation),
		backLinkUrl: getBackLinkUrl(repMode, caseId, representation.pageLinks),
		checkLinks: getRepModeLinks(representation.pageURLs, repModeLinkOptions.check),
		pageTitle: 'Check your answers',
		pageHeading: 'Check your answers',
		representation
	};
};
