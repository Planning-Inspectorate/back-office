import { mappedPageLinks } from '../../representation/utils/get-page-links.js';
import { getRepresentationPageURLs } from '../../representation/utils/get-representation-page-urls.js';
import { getRepresentationBaseUrl } from '../../representation/utils/get-representation-page-urls.js';
import { repModeLinkOptions } from '../../utils/get-rep-mode-links.js';

/**
 * @param {string} caseId
 * @param {string} repMode
 * @param {string} representationId
 * @param {string} status
 * @returns {object}
 */
export const getPageLinks = (caseId, repMode, representationId, status) => {
	const representationBaseUrl = getRepresentationBaseUrl(caseId);
	let backLinkUrl = representationBaseUrl;

	if (status === 'DRAFT' && repMode !== repModeLinkOptions.summary)
		backLinkUrl = getRepresentationPageURLs(caseId, representationId).attachmentUpload;

	return mappedPageLinks(backLinkUrl, representationBaseUrl);
};
