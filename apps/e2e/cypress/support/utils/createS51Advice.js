// @ts-nocheck
import { faker } from '@faker-js/faker';
import { getShortMonthName } from './utils.js';

export const s51AdviceDetails = () => {
	const title = faker.lorem.sentences(1);
	const enquiryDetails = faker.lorem.sentences();
	const adviceDetails = faker.lorem.sentences();
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();
	const organisation = faker.company.name();
	const enquirerFull = `${firstName} ${lastName}, ${organisation}`;
	const adviserName = faker.name.firstName();
	const methods = ['Phone', 'Email', 'Meeting', 'Post'];
	const methodOfEnquiry = faker.helpers.arrayElement(methods);

	const year = new Date().getFullYear();
	const month = new Date().getMonth().toString().padStart(2, '0');
	const day = new Date().getDay().toString().padStart(2, '0');

	const dateFullFormatted = `${day} ${getShortMonthName(month)} ${year}`;

	return {
		title,
		adviceDetails,
		enquiryDetails,
		enquirerFull,
		adviserName,
		day,
		month,
		year,
		dateFullFormatted,
		firstName,
		lastName,
		organisation,
		methodOfEnquiry
	};
};
