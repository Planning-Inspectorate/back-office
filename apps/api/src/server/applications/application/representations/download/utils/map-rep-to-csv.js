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
const mapToCSV = (arrayToMap) =>
	arrayToMap.map((representaion) => ({
		'IP number': representaion.reference,
		...mapContactDetails(representaion)
	}));

export const mapRepToCsv = (chunk) =>
	stringify(mapToCSV(chunk), { header: chunk.setCSVHeader, escape_formulas: true });
