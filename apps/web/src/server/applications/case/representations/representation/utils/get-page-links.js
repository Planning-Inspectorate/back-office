import { repModeLinkOptions } from '../../utils/get-rep-mode-links.js';
import {
	getRepresentaionDetailsPageUrl,
	getRepresentationBaseUrl,
	repRoutes
} from './get-representation-page-urls.js';

/**
 * @typedef {object} PageURLs
 * @property {string} addressDetails
 * @property {string} agentAddressDetails
 * @property {string} contactDetails
 * @property {string} agentContactDetails
 * @property {string} contactMethod
 * @property {string} agentContactMethod
 * @property {string} representationType
 * @property {string} under18
 * @property {string} representationEntity
 * @property {string} addRepresentation
 * @property {string} attachmentUpload
 * @property {string} checkAnswers
 */

/**
 * @typedef {object|*} MappedPageLinks
 * @property {string} backLinkUrl
 * @property {string} redirectUrl
 */

/**
 * @param {string|null} backLinkUrl
 * @param {string|null} redirectUrl
 * @returns {MappedPageLinks}
 */
const mappedPageLinks = (backLinkUrl, redirectUrl) => ({
	backLinkUrl,
	redirectUrl
});

/**
 * @param {string} path
 * @param {PageURLs} pageURLs
 * @returns {MappedPageLinks}
 */
const getRepresentativePageLinks = (path, pageURLs) => {
	switch (path) {
		case repRoutes.contactDetails:
			return mappedPageLinks(pageURLs.representationEntity, pageURLs.agentAddressDetails);
		case repRoutes.addressDetails:
			return mappedPageLinks(pageURLs.agentContactDetails, pageURLs.agentContactMethod);
		case repRoutes.contactMethod:
			return mappedPageLinks(pageURLs.agentAddressDetails, pageURLs.addRepresentation);
		default:
			return mappedPageLinks(null, null);
	}
};

/**
 * @param {string} path
 * @param {PageURLs} pageURLs
 * @param {string} caseId
 * @returns {MappedPageLinks}
 */
const getRepresentedPageLinks = (path, pageURLs, caseId) => {
	switch (path) {
		case repRoutes.contactDetails:
			return mappedPageLinks(getRepresentationBaseUrl(caseId), pageURLs.addressDetails);
		case repRoutes.addressDetails:
			return mappedPageLinks(pageURLs.contactDetails, pageURLs.contactMethod);
		case repRoutes.contactMethod:
			return mappedPageLinks(pageURLs.addressDetails, pageURLs.representationType);
		case repRoutes.representationType:
			return mappedPageLinks(pageURLs.contactMethod, pageURLs.under18);
		case repRoutes.under18:
			return mappedPageLinks(pageURLs.representationType, pageURLs.representationEntity);
		case repRoutes.representationEntity:
			return mappedPageLinks(pageURLs.under18, null);
		case repRoutes.addRepresentation:
			return mappedPageLinks(pageURLs.representationEntity, pageURLs.attachmentUpload);
		case repRoutes.attachmentUpload:
			return mappedPageLinks(pageURLs.addRepresentation, null);
		default:
			return mappedPageLinks(null, null);
	}
};

/**
 * @param {string|undefined} repMode
 * @param {string} path
 * @param {string} caseId
 * @param {string} repId
 * @param {string} repType
 * @param {PageURLs} pageURLs
 * @returns {MappedPageLinks}
 */
export const getPageLinks = (repMode, path, caseId, repId, repType, pageURLs) => {
	let pageLinks = mappedPageLinks(null, null);

	if (repMode === repModeLinkOptions.change) {
		const representaionDetailsPageUrl = getRepresentaionDetailsPageUrl(caseId, repId);
		pageLinks = mappedPageLinks(representaionDetailsPageUrl, representaionDetailsPageUrl);
	} else if (repMode === repModeLinkOptions.check)
		pageLinks = mappedPageLinks(pageURLs.checkAnswers, pageURLs.checkAnswers);
	else if (path === repRoutes.checkAnswers)
		pageLinks = mappedPageLinks(pageURLs.attachmentUpload, getRepresentationBaseUrl(caseId));
	else if (repType === 'represented') pageLinks = getRepresentedPageLinks(path, pageURLs, caseId);
	else if (repType === 'representative') pageLinks = getRepresentativePageLinks(path, pageURLs);

	return pageLinks;
};
