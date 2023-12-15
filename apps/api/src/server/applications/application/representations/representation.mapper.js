import { isEmpty, pick } from 'lodash-es';

/**
 * @param {number} caseId
 * @param {import("@pins/applications").CreateUpdateRepresentation} representation
 * @param {string} method
 * @returns {import("../../../repositories/representation.repository.js").CreateRepresentationParams}
 */
export const mapCreateOrUpdateRepRequestToRepository = (
	caseId,
	representation,
	method = 'POST'
) => {
	let defaultRepresentationDetails = pick(representation, [
		'originalRepresentation',
		'status',
		'reference',
		'redacted',
		'received',
		'type',
		'representedType'
	]);

	if (method === 'POST') {
		defaultRepresentationDetails = {
			reference: '',
			caseId,
			status: representation.status || 'DRAFT',
			originalRepresentation: representation.originalRepresentation || '',
			redacted: representation.redacted || false,
			received: representation.received,
			representedType: representation.representedType,
			type: representation.type
		};
	}

	const formatContactDetails = (contact) => {
		return pick(contact, [
			'organisationName',
			'firstName',
			'middleName',
			'lastName',
			'jobTitle',
			'email',
			'website',
			'under18',
			'contactMethod',
			'phoneNumber'
		]);
	};

	const formatAddressDetails = (address) => {
		return pick(address, ['addressLine1', 'addressLine2', 'town', 'county', 'postcode', 'country']);
	};

	const formattedRepresented = formatContactDetails(representation.represented);
	const formattedRepresentedAddress = formatAddressDetails(representation.represented?.address);
	const formattedRepresentative = formatContactDetails(representation.representative);
	const formattedRepresentativeAddress = formatAddressDetails(
		representation.representative?.address
	);

	return {
		...(!isEmpty(defaultRepresentationDetails) && {
			representationDetails: defaultRepresentationDetails
		}),
		...(!isEmpty(formattedRepresented) && {
			represented: formattedRepresented
		}),
		...(!isEmpty(formattedRepresentedAddress) && {
			representedAddress: formattedRepresentedAddress
		}),
		...(!isEmpty(formattedRepresentative) && {
			representative: formattedRepresentative
		}),
		...(!isEmpty(formattedRepresentativeAddress) && {
			representativeAddress: formattedRepresentativeAddress
		})
	};
};

/**
 *
 * @param {object} representations
 * @param {*} representations.representationActions
 * @return { actionBy: string, notes: string }
 */
export const getLatestRedaction = ({ representationActions }) =>
	representationActions.filter(({ type }) => type === 'REDACTION').shift();

/**
 *
 * @param {object} attachments
 * @param {string} attachments.id
 * @param {string} attachments.documentGuid
 * @param {*} attachments.Document
 * @return {*}
 */
export const mapDocumentRepresentationAttachments = (attachments) =>
	attachments.map((attachment) => {
		return {
			attachmentId: attachment.id,
			documentId: attachment.documentGuid,
			filename: attachment.Document?.latestDocumentVersion?.fileName
		};
	});

/**
 *
 * @param {object} statusWithCount
 * @param {string} statusWithCount.status
 * @param {string} statusWithCount._count._all
 * @return {*}
 */
export const mapCaseRepresentationsStatusCount = (statusWithCount) =>
	statusWithCount.map((el) => ({
		count: el._count._all,
		name: el.status
	}));

/**
 * @typedef {object} under18Data
 * @property {object} under18Data._count
 * @property {number} under18Data._count.contacts
 *
 */

/**
 * Return subset of Representation properties
 * @param {Prisma.RepresentationSelect} representation
 * @return {{id: string, reference: string, status: string, redacted: boolean, received: boolean, firstName: string, lastName: string, organisationName: string}}
 */
export const mapRepresentationSummary = (representation) => {
	const representationSummary = pick(representation, [
		'id',
		'reference',
		'status',
		'redacted',
		'received'
	]);

	const contact = representation.represented;

	return {
		...representationSummary,
		firstName: contact?.firstName,
		lastName: contact?.lastName,
		organisationName: contact?.organisationName
	};
};
