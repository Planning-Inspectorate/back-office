import { stringify } from 'csv-stringify/sync';

export const getOrgNameOrName = ({ organisationName, firstName = '', lastName = '' }) =>
	organisationName ? organisationName : `${firstName} ${lastName}`.trim();

const addressLineTwo = ({ addressLine1 = '', addressLine2 = '' }) =>
	`${addressLine1} ${addressLine2}`;

const getTownOrCountry = (address) => (address.town ? address.town : address.country);

const getCountryIfTown = (address) => (address?.town ? address?.country : '');
const mapContactDetails = (data) => {
	const { represented, representative } = data;
	const { email, address, contactMethod, organisationName, firstName, lastName } = representative
		? representative
		: represented;

	return {
		'On behalf of': representative ? getOrgNameOrName(represented) : '',
		'Email Address': email,
		'address line 1': getOrgNameOrName({ organisationName, firstName, lastName }),
		'address line 2': addressLineTwo(address),
		'address line 3': getTownOrCountry(address),
		'address line 4': getCountryIfTown(address),
		'address line 5': '',
		'address line 6': '',
		postcode: address?.postcode,
		'Email or Post?': contactMethod
	};
};

const mapShortenedContactDetails = (data) => {
	const { represented, representative } = data;
	const { address, organisationName, firstName, lastName } = representative
		? representative
		: represented;

	return {
		Name: getOrgNameOrName({ organisationName, firstName, lastName }),
		Postcode: address?.postcode
	};
};

const mapPublishedToCSV = (arrayToMap) =>
	arrayToMap.map((representation) => ({
		'IP number': representation.reference,
		...mapContactDetails(representation)
	}));

const mapValidToCSV = (arrayToMap) => {
	const mapped = arrayToMap.map((representation) => ({
		...mapShortenedContactDetails(representation),
		Attachments: representation._count.attachments > 0 ? 'Yes' : 'No',
		'IP number': representation.reference,
		Status: representation.status,
		'Action Date': (() => {
			const validActions = representation?.representationActions?.filter(
				(action) => action.status === 'VALID'
			);
			if (!validActions?.length) return '';
			return validActions
				.map((action) => new Date(action.actionDate))
				.sort((a, b) => b - a)[0]
				.toISOString();
		})(),
		Representation: (() => {
			const value = representation.editedRepresentation?.trim()
				? representation.editedRepresentation
				: representation.originalRepresentation;
			const CSV_CELL_LIMIT = 32759;
			if (value && value.length > CSV_CELL_LIMIT) {
				return 'This representation exceeds the character limit, please view on the Relevant Representations page.';
			}
			return value;
		})()
	}));
	return mapped.sort((a, b) => {
		if (!a['Action Date']) return 1;
		if (!b['Action Date']) return -1;
		return new Date(b['Action Date']) - new Date(a['Action Date']);
	});
};

export const mapPublishedRepToCsv = (chunk) =>
	stringify(mapPublishedToCSV(chunk), { header: chunk.setCSVHeader, escape_formulas: true });

export const mapValidRepToCsv = (chunk) =>
	stringify(mapValidToCSV(chunk), { header: chunk.setCSVHeader, escape_formulas: true });
