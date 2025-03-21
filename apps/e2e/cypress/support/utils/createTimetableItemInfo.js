// @ts-nocheck
import { faker } from '@faker-js/faker';
import { getShortFormattedDate } from './utils.js';

export const timetableItem = () => {
	const now = Date.now();
	const currentYear = new Date().getFullYear();

	const itemName = `Test_Item_${now}`;
	Cypress.env('currentCreatedItem', itemName);
	const description = `Exam timetable description
  * Exam timetable item`;

	const dayAsInteger = faker.datatype.number({
		min: 10,
		max: 28
	});

	const monthAsInteger = faker.datatype.number({
		min: 1,
		max: 12
	});

	const yearAsInteger = faker.datatype.number({
		min: currentYear + 1,
		max: currentYear + 5
	});

	const day = dayAsInteger.toString().padStart(2, '0');
	const month = monthAsInteger.toString().padStart(2, '0');
	const startYear = yearAsInteger.toString();
	const endYear = (yearAsInteger + 1).toString();

	const startDate = getShortFormattedDate(new Date(`${startYear}-${month}-${day}`));
	const endDate = getShortFormattedDate(new Date(`${endYear}-${month}-${day}`));

	const startDateFull = startDate;
	const endDateFull = endDate;
	const startDateFullDeadLine = startDate;
	const endDateFullDeadLine = endDate;

	const minutes = '00';
	const startHourAsInteger = faker.datatype.number({
		min: 1,
		max: 11
	});

	const startHour = startHourAsInteger.toString().padStart(2, '0');
	const endHour = (startHourAsInteger + 1).toString().padStart(2, '0');

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
		endTimeFormatted,
		startDateFullDeadLine,
		endDateFullDeadLine
	};
};
