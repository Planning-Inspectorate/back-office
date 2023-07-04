import {
	getRepresentaionDetailsPageUrl,
	getRepresentationPageURLs
} from '../representation/utils/get-representation-page-urls.js';
import { getRepModeLinks } from './get-rep-mode-links.js';

/**
 *
 * @param {object|*} rep
 * @param {string} caseId
 * @param {string|null} repMode
 * @returns {string}
 */
export const getFinalRepPageUrl = ({ id, status }, caseId, repMode = null) => {
	let finalRepPageUrl = getRepresentaionDetailsPageUrl(caseId, id);

	if (status === 'DRAFT') {
		const representationPageURLs = getRepresentationPageURLs(caseId, id);

		finalRepPageUrl = repMode
			? getRepModeLinks(representationPageURLs, repMode).checkAnswers
			: representationPageURLs.checkAnswers;
	}

	return finalRepPageUrl;
};
