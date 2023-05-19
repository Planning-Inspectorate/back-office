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
		'received'
	]);

	if (method === 'POST') {
		defaultRepresentationDetails = {
			reference: '',
			caseId,
			status: representation.status || 'DRAFT',
			originalRepresentation: representation.originalRepresentation || '',
			redacted: representation.redacted || false,
			received: representation.received || new Date()
		};
	}

	const formatContactDetails = (contact) => {
		return pick(contact, [
			'organisationName',
			'firstName',
			'middleName',
			'lastName',
			'email',
			'website',
			'under18',
			'type',
			'contactMethod',
			'phoneNumber'
		]);
	};

	const formatAddressDetails = (address) => {
		return pick(address, ['addressLine1', 'addressLine2', 'town', 'county', 'postcode']);
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
			represented:
				method === 'POST'
					? checkContactMandatoryFields(formattedRepresented, 'PERSON', false)
					: formattedRepresented
		}),
		...(!isEmpty(formattedRepresentedAddress) && {
			representedAddress: formattedRepresentedAddress
		}),
		...(!isEmpty(formattedRepresentative) && {
			representative:
				method === 'POST'
					? checkContactMandatoryFields(formattedRepresentative, 'AGENT', false)
					: formattedRepresentative
		}),
		...(!isEmpty(formattedRepresentativeAddress) && {
			representativeAddress: formattedRepresentativeAddress
		})
	};
};

/**
 *
 * @param {import("../../../repositories/representation.repository.js").Contact} contactDetails
 * @param {string} type
 * @param {boolean} under18
 * @returns {import("../../../repositories/representation.repository.js").Contact}
 */
function checkContactMandatoryFields(contactDetails, type, under18) {
	if (!contactDetails.under18) contactDetails.under18 = under18;
	if (!contactDetails.type) contactDetails.type = type;

	return contactDetails;
}
