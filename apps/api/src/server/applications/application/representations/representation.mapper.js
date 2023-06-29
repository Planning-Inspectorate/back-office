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
		'type'
	]);

	if (method === 'POST') {
		defaultRepresentationDetails = {
			reference: '',
			caseId,
			status: representation.status || 'DRAFT',
			originalRepresentation: representation.originalRepresentation || '',
			redacted: representation.redacted || false,
			received: representation.received
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
			'type',
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
			representative: { ...formattedRepresentative, type: 'AGENT' }
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
	representationActions.filter(({ type }) => type === 'REDACTION').pop();

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
			filename: attachment.Document?.name
		};
	});
