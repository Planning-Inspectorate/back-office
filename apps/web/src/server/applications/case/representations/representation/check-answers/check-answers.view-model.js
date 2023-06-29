import { getRepModeLinks } from '../../utils/get-rep-mode-links.js';
import { getRepresentationBaseUrl } from '../utils/get-representation-page-urls.js';
import { getSelectedOptionsText } from '../utils/get-selected-options-text.js';

/**
 * @typedef {object|*} Locals
 * @property {object} representation
 */

/**
 * @param {string} caseId
 * @param {Locals} locals
 * @returns {string}
 */
const getBackLinkUrl = (caseId, { pageLinks, status }) =>
	status === 'DRAFT' ? pageLinks.backLinkUrl : getRepresentationBaseUrl(caseId);

/**
 * @param {string} caseId
 * @param {Locals} locals
 * @returns {object}
 */
export const getCheckAnswersViewModel = (caseId, { representation }) => {
	return {
		...getSelectedOptionsText(representation),
		backLinkUrl: getBackLinkUrl(caseId, representation),
		checkLinks: getRepModeLinks(representation.pageURLs, 'check'),
		pageTitle: 'Check your answers',
		pageHeading: 'Check your answers',
		representation
	};
};
