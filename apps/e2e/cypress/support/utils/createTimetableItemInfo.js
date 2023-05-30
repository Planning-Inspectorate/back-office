// @ts-nocheck
import { faker } from '@faker-js/faker';

const getShortMonthName = (monthNumber) => {
	const date = new Date();
	date.setMonth(monthNumber - 1);
	return date.toLocaleString('default', { month: 'short' });
};

export const timetableItem = () => {
	const now = Date.now();
	const currentYear = new Date().getFullYear();

	const itemName = `Test_Item_${now}`;
	const description = faker.lorem.sentences();

	const day = faker.datatype
		.number({
			min: 1,
			max: 28
		})
		.toString()
		.padStart(2, '0');

	const month = faker.datatype
		.number({
			min: 1,
			max: 12
		})
		.toString()
		.padStart(2, '0');

	const startYear = faker.datatype
		.number({
			min: currentYear + 1,
			max: currentYear + 5
		})
		.toString();

	const endYear = (parseInt(startYear) + 1).toString().padStart(2, '0');

	const minutes = '00';

	const startHour = faker.datatype
		.number({
			min: 1,
			max: 24
		})
		.toString()
		.padStart(2, '0');

	const endHour = (parseInt(startHour) + 1).toString().padStart(2, '0');

	const startDateFull = `${day} ${getShortMonthName(month).substring(0, 3)} ${startYear}`;
	const endDateFull = `${day} ${getShortMonthName(month).substring(0, 3)} ${endYear}`;
	const startTimeFormatted = `${startHour}:${minutes}`;
	const endTimeFormatted = `${endHour}:${minutes}`;

	return {
		itemName,
		day,
		month,
		startYear,
		endYear,
		minutes,
		startHour,
		endHour,
		description,
		currentYear,
		startDateFull,
		endDateFull,
		startTimeFormatted,
		endTimeFormatted
	};
};
