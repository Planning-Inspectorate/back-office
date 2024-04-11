// @ts-nocheck
import { faker } from '@faker-js/faker';
import { getShortMonthName } from './utils.js';

export const s51AdviceDetails = (titleCount) => {
	const title = titleCount ? 'title-' + titleCount : 'title';
	const enquiryDetails = 'enquiry details';
	const adviceDetails = 'Advice details';
	const firstName = 'S51firstname';
	const lastName = 'S51secondname';
	const organisation = 'Organisation name';
	const enquirerFull = `${firstName} ${lastName}, ${organisation}`;
	const adviserName = 'Advisername';
	const methods = ['Phone', 'Email', 'Meeting', 'Post'];
	const methodOfEnquiry = faker.helpers.arrayElement(methods);

	const year = new Date().getFullYear();
	var todaydate = new Date();
	var mon = todaydate.getMonth();
	var month = mon.toString().padStart(2, '0');
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
