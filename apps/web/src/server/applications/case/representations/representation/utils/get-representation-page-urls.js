export const repRoutes = {
	contactDetails: '/contact-details',
	addressDetails: '/address-details',
	contactMethod: '/contact-method',
	representationType: '/representation-type',
	under18: '/under-18',
	representationEntity: '/representation-entity',
	addRepresentation: '/add-representation',
	attachmentUpload: '/attachment-upload',
	checkAnswers: '/check-answers'
};

/**
 * @param {string} route
 * @param {string} caseId
 * @param {string} repId
 * @param {string|null} repType
 * @returns {string}
 */
export const buildRepresentationPageURL = (route, caseId, repId, repType) => {
	const baseURL = getRepresentationBaseUrl(caseId);

	const Params = new URLSearchParams();
	if (repId) Params.append('repId', repId);
	if (repType) Params.append('repType', repType);

	return `${baseURL}${route}?${Params.toString()}`;
};

/**
 * @param {string} caseId
 * @returns {string}
 */
export const getRepresentationBaseUrl = (caseId) =>
	`/applications-service/case/${caseId}/relevant-representations`;

/**
 * @param {string} caseId
 * @param {string} repId
 * @returns {string}
 */
export const getRepresentaionDetailsPageUrl = (caseId, repId) =>
	`${getRepresentationBaseUrl(caseId)}/${repId}/representation-details`;

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
 * @param {string} caseId
 * @param {string} repId
 * @returns {PageURLs}
 */
export const getRepresentationPageURLs = (caseId, repId) => ({
	contactDetails: buildRepresentationPageURL(
		repRoutes.contactDetails,
		caseId,
		repId,
		'represented'
	),
	agentContactDetails: buildRepresentationPageURL(
		repRoutes.contactDetails,
		caseId,
		repId,
		'representative'
	),
	addressDetails: buildRepresentationPageURL(
		repRoutes.addressDetails,
		caseId,
		repId,
		'represented'
	),
	agentAddressDetails: buildRepresentationPageURL(
		repRoutes.addressDetails,
		caseId,
		repId,
		'representative'
	),
	contactMethod: buildRepresentationPageURL(repRoutes.contactMethod, caseId, repId, 'represented'),
	agentContactMethod: buildRepresentationPageURL(
		repRoutes.contactMethod,
		caseId,
		repId,
		'representative'
	),
	representationType: buildRepresentationPageURL(
		repRoutes.representationType,
		caseId,
		repId,
		'represented'
	),
	under18: buildRepresentationPageURL(repRoutes.under18, caseId, repId, 'represented'),
	representationEntity: buildRepresentationPageURL(
		repRoutes.representationEntity,
		caseId,
		repId,
		'represented'
	),
	addRepresentation: buildRepresentationPageURL(
		repRoutes.addRepresentation,
		caseId,
		repId,
		'represented'
	),
	attachmentUpload: buildRepresentationPageURL(
		repRoutes.attachmentUpload,
		caseId,
		repId,
		'represented'
	),
	checkAnswers: buildRepresentationPageURL(repRoutes.checkAnswers, caseId, repId, null)
});
