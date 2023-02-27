// @ts-nocheck
import { faker } from '@faker-js/faker';
import { SECTORS, SUBSECTORS } from './options';
import { REGIONS } from './options';
import { ZOOM_LEVELS } from './options';

let sector = faker.helpers.arrayElement(SECTORS);
let subsector = faker.helpers.arrayElement(SUBSECTORS[sector]);

export const projectInformation = () => {
	const now = Date.now();
	const currentYear = new Date().getFullYear();

	// P R O J E C T  I N F O R M A T I O N
	let projectName = `Automation_Test_Case_${now}`;
	let projectDescription = faker.lorem.sentence();
	let projectLocation = faker.lorem.sentence();
	const gridRefEasting = faker.random.numeric(6);
	const gridRefNorthing = faker.random.numeric(6);
	const regions = faker.helpers.arrayElements(REGIONS).sort();
	const zoomLevel = faker.helpers.arrayElement(ZOOM_LEVELS);
	const projectEmail = faker.internet.email();

	// A P P L I C A N T  I N F O R M A T I O N
	let orgName = `Automation_Test_Org_${now}`;
	let applicantFirstName = faker.name.firstName();
	let applicantLastName = faker.name.lastName();
	let applicantFullName = `${applicantFirstName} ${applicantLastName}`;
	const postcode = 'BS1 6PN';
	const postcode2 = 'SW1P 4DF';
	let applicantFullAddress = `2 Temple Quay, Planning Inspectorate, Bristol, ${postcode}`;
	let applicantFullAddress2 = `2 Marsham Street, Home Office, London, ${postcode2}`;
	const applicantWebsite = faker.internet.url();
	const applicantEmail = `${applicantFirstName}.${applicantLastName}@email.com`;
	const applicantPhoneNumber = faker.phone.number('+4479########');

	// K E Y  D A T E S
	const publishedDate = `Q${faker.datatype.number({
		min: 1,
		max: 4
	})} ${
		currentYear +
		faker.datatype.number({
			min: 1,
			max: 10
		})
	}`;

	const internalDateDay = faker.datatype
		.number({
			min: 1,
			max: 28
		})
		.toString();

	const internalDateMonth = faker.datatype
		.number({
			min: 1,
			max: 12
		})
		.toString();

	const internalDateYear = faker.datatype
		.number({
			min: new Date().getFullYear() + 1,
			max: new Date().getFullYear() + 5
		})
		.toString();

	function convertDate() {
		const internalDateFull = `${internalDateDay}/${internalDateMonth}/${internalDateYear}`;
		let [day, month, year] = internalDateFull.split('/');
		if (parseInt(day) < 10) {
			day = '0' + day;
		}
		if (parseInt(month) < 10) {
			month = '0' + month;
		}
		return `${day}/${month}/${year}`;
	}

	return {
		applicantEmail,
		applicantFirstName,
		applicantFullAddress,
		applicantFullAddress2,
		applicantFullName,
		applicantLastName,
		applicantPhoneNumber,
		applicantWebsite,
		gridRefEasting,
		gridRefNorthing,
		internalDateDay,
		internalDateFull: convertDate(),
		internalDateMonth,
		internalDateYear,
		orgName,
		postcode,
		postcode2,
		projectDescription,
		projectEmail,
		projectLocation,
		projectName,
		publishedDate,
		regions,
		sector,
		subsector,
		zoomLevel
	};
};
