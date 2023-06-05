import { dateString } from '../../../lib/nunjucks-filters/date.js';
import {
	createCaseTimetableItem,
	getCaseTimetableItemTypes,
	getCaseTimetableItems
} from './applications-timetable.service.js';
import { format } from 'date-fns';

/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetableCreateBody} ApplicationsTimetableCreateBody */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetable} ApplicationsTimetable */

/** @type {Record<string, Record<string, boolean>>} */
export const timetableTemplatesSchema = {
	'starttime-mandatory': {
		name: true,
		date: true,
		startTime: true,
		endTime: false,
		description: false
	},
	deadline: {
		name: true,
		startDate: false,
		endDate: true,
		startTime: false,
		endTime: true,
		description: false
	},
	'deadline-startdate-mandatory': {
		name: true,
		startDate: true,
		endDate: true,
		startTime: true,
		endTime: true,
		description: false
	},
	'starttime-optional': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'no-times': {
		name: true,
		date: true,
		description: false
	}
};

/**
 * View the examination timetable page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {caseId: string}>}
 */
export async function viewApplicationsCaseExaminationTimeTable(request, response) {
	const timetableItems = await getCaseTimetableItems(+request.params.caseId);
	const timetableItemsViewData = timetableItems.map((timetableItem) => {
		return {
			...timetableItem,
			description: JSON.parse(timetableItem.description),
			startDate: timetableItem.startDate
				? format(new Date(timetableItem.startDate), 'dd MMM yyyy')
				: null,
			date: format(new Date(timetableItem.date), 'dd MMM yyyy'),
			heading: `${format(new Date(timetableItem.date), 'dd MMM yyyy')} - ${timetableItem.name}`
		};
	});
	response.render(`applications/case/examination-timetable`, {
		selectedPageType: 'examination-timetable',
		timetableItems: timetableItemsViewData
	});
}

/**
 * Set the type of examination timetable to create
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: {text: string, value: string}[]}, {}, {}, {}, {}>}
 */
export async function viewApplicationsCaseTimetableNew(request, response) {
	const timetableTypes = await getCaseTimetableItemTypes();

	const formattedTimetableTypes = timetableTypes.map((timetableType) => ({
		text: timetableType.displayNameEn,
		value: timetableType.name
	}));

	response.render(`applications/case-timetable/timetable-new-item-type.njk`, {
		timetableItems: formattedTimetableTypes
	});
}

/**
 * Dispatch the new examination timetable to the right template
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {'timetable-type': string}, {}, {}>}
 */
export async function postApplicationsCaseTimetableNew(request, response) {
	const selectedItemTypeName = request.body['timetable-type'];

	const formProperties = await getCreateTimetableFormProperties(selectedItemTypeName);

	if (formProperties) {
		return response.render(`applications/case-timetable/timetable-new-item-details.njk`, {
			...formProperties,
			values: request.body
		});
	}

	response.render(`app/500.njk`);
}

/**
 * Handle the new examination timetable details form
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function postApplicationsCaseTimetableDetails(
	{ errors: validationErrors, body },
	response
) {
	if (validationErrors) {
		const formProperties = await getCreateTimetableFormProperties(body.itemTypeName);

		return response.render(`applications/case-timetable/timetable-new-item-details.njk`, {
			errors: validationErrors,
			values: body,
			...formProperties
		});
	}

	return response.redirect(307, './check-your-answers');
}

/**
 * New examination timetable check your anwers page
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function postApplicationsCaseTimetableCheckYourAnswers({ body }, response) {
	const rows = getCheckYourAnswersRows(body);

	response.render(`applications/case-timetable/timetable-check-your-answers.njk`, {
		rows,
		values: body
	});
}

/**
 * Save new examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function postApplicationsCaseTimetableSave({ body }, response) {
	const splitDescription = body.description.split('*');
	const preText = splitDescription.shift();
	const bulletPoints = splitDescription;
	const startDate = body['startDate.year']
		? new Date(`${body['startDate.year']}-${body['startDate.month']}-${body['startDate.day']}`)
		: null;
	const date =
		body['endDate.year'] && !body['date.year']
			? new Date(`${body['startDate.year']}-${body['startDate.month']}-${body['startDate.day']}`)
			: new Date(`${body['date.year']}-${body['date.month']}-${body['date.day']}`);

	/** @type {ApplicationsTimetable} */
	const payload = {
		caseId: response.locals.caseId,
		examinationTypeId: Number.parseInt(body['timetable-id'], 10),
		name: body.name,
		description: JSON.stringify({ preText, bulletPoints }),
		date,
		startDate,
		startTime: body['startTime.hours']
			? `${body['startTime.hours']}:${body['startTime.minutes']}`
			: null,
		endTime: body['endTime.hours'] ? `${body['endTime.hours']}:${body['endTime.minutes']}` : null
	};

	const { errors } = await createCaseTimetableItem(payload);

	if (errors) {
		const rows = getCheckYourAnswersRows(body);

		return response.render(`applications/case-timetable/timetable-check-your-answers.njk`, {
			rows,
			values: body,
			errors
		});
	}

	response.redirect(`./success`);
}

/**
 * Success banner when successfully creating a new examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function showApplicationsCaseTimetableSuccessBanner(request, response) {
	response.render('applications/case-timetable/timetable-new-item-success.njk');
}

/**
 *
 * @param {string} selectedItemTypeName
 * @returns {Promise<{selectedItemType: {text: string, value: string}, templateFields: Record<string, boolean>}|null>}
 */
const getCreateTimetableFormProperties = async (selectedItemTypeName) => {
	const timetableItemTypes = await getCaseTimetableItemTypes();

	const selectedItemType = timetableItemTypes.find(
		(itemType) => itemType.name === selectedItemTypeName
	);

	if (selectedItemType) {
		const formattedSelectedItemType = {
			text: selectedItemType.displayNameEn,
			value: selectedItemType.name,
			templateType: selectedItemType.templateType,
			id: selectedItemType.id
		};
		const templateFields = timetableTemplatesSchema[selectedItemType.templateType];

		return { selectedItemType: formattedSelectedItemType, templateFields };
	}

	return null;
};

/**
 *
 * @param {ApplicationsTimetableCreateBody} body
 * @returns {{key: {text: string}, value: {html: string}}[]}
 */
const getCheckYourAnswersRows = (body) => {
	const { description, name, itemTypeName } = body;

	const date = dateString(body['date.year'], body['date.month'], body['date.day']);
	const startDate = dateString(
		body['startDate.year'],
		body['startDate.month'],
		body['startDate.day']
	);
	const endDate = dateString(body['endDate.year'], body['endDate.month'], body['endDate.day']);
	const startTime = body['startTime.hours']
		? `${body['startTime.hours']}:${body['startTime.minutes']}`
		: null;
	const endTime = body['endTime.hours']
		? `${body['endTime.hours']}:${body['endTime.minutes']}`
		: null;

	/** @type {{key: string, value: string}[]} */
	const rowsItems = [
		{ key: 'Item type', value: itemTypeName },
		{ key: 'Item name', value: name },
		...(date ? [{ key: 'Date', value: date }] : []),
		...(startDate ? [{ key: 'Start date', value: startDate }] : []),
		...(endDate ? [{ key: 'End date', value: endDate }] : []),
		...(startTime ? [{ key: 'Start time', value: startTime }] : []),
		...(endTime ? [{ key: 'End time', value: endTime }] : []),
		{
			key: 'Timetable item description (optional)',
			value: (description || '').replace(/\*/g, '&middot;').replace(/\n/g, '<br />')
		}
	];

	return rowsItems.map((rowItem) => ({
		key: {
			text: rowItem.key
		},
		value: {
			html: rowItem.value
		}
	}));
};
