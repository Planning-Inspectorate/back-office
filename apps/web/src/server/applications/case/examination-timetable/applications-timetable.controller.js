import { dateString, displayDate } from '../../../lib/nunjucks-filters/date.js';
import {
	createCaseTimetableItem,
	getCaseTimetableItemTypes,
	getCaseTimetableItems,
	publishCaseTimetableItems,
	getCaseTimetableItemById,
	deleteCaseTimetableItem
} from './applications-timetable.service.js';

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
 * @type {import('@pins/express').RenderHandler<{timetableItems: Record<string, any>, publishedStatus: boolean}>}
 */
export async function viewApplicationsCaseExaminationTimeTable(request, response) {
	const timetableItems = await getCaseTimetableItems(response.locals.caseId);

	const timetableItemsViewData = timetableItems.map((timetableItem) =>
		getTimetableRows(timetableItem)
	);
	const publishedStatus = timetableItems?.length > 0 && timetableItems[0]?.published;

	response.render(`applications/case/examination-timetable`, {
		timetableItems: timetableItemsViewData,
		publishedStatus
	});
}

/**
 * View the preview page of the examination timetable for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Array<Record<string, any>>, backLink: string}>}
 */
export async function previewApplicationsCaseExaminationTimeTable(_, response) {
	const timetableItems = await getCaseTimetableItems(response.locals.caseId);

	const timetableItemsViewData = timetableItems.map((timetableItem) =>
		getTimetableRows(timetableItem)
	);

	response.render(`applications/case-timetable/timetable-preview.njk`, {
		timetableItems: timetableItemsViewData,
		backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`
	});
}

/**
 * View the examination timetable page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function publishApplicationsCaseExaminationTimeTable(request, response) {
	await publishCaseTimetableItems(response.locals.caseId);

	// TODO: handle errors

	response.redirect(`./publish/success`);
}

/**
 * View the delete page for the examination timetable for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItem: Record<string, string>}, {}, {}, {}, {timetableId: string}>}
 */
export async function showApplicationsCaseTimetableDelete(request, response) {
	const timetableItem = await getCaseTimetableItemById(+request.params.timetableId);
	const timetableItemViewData = await getTimetableRows(timetableItem);

	response.render(`applications/case-timetable/timetable-delete.njk`, {
		timetableItem: timetableItemViewData
	});
}

/**
 * View the delete page for the examination timetable for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {timetableId: string}>}
 */
export async function deleteApplicationsCaseTimetable(request, response) {
	const { errors } = await deleteCaseTimetableItem(+request.params.timetableId);

	if (errors) {
		const timetableItem = await getCaseTimetableItemById(+request.params.timetableId);
		const timetableItemViewData = await getTimetableRows(timetableItem);

		return response.render(`applications/case-timetable/timetable-delete.njk`, {
			timetableItem: timetableItemViewData,
			errors
		});
	}

	response.render(`applications/case-timetable/timetable-new-item-success.njk`, {
		isDeleted: true
	});
}
/**
 * Set the type of examination timetable to create
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: {text: string, value: string}[]}, {}, {}, {}, {}>}
 */
export async function viewApplicationsCaseTimetableNew(_, response) {
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
			? new Date(`${body['endDate.year']}-${body['endDate.month']}-${body['endDate.day']}`)
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
		endTime: body['endTime.hours'] ? `${body['endTime.hours']}:${body['endTime.minutes']}` : null,
		published: false
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
 * Success banner when successfully creating a new examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function showApplicationsCaseTimetablePublishSuccessBanner(request, response) {
	response.render('applications/case-timetable/timetable-item-publish-success.njk');
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
	const { description, name, itemTypeName, templateType } = body;

	const shouldShowField = (/** @type {string} */ fieldName) =>
		Object.prototype.hasOwnProperty.call(timetableTemplatesSchema[templateType], fieldName);

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
		...(shouldShowField('date') ? [{ key: 'Date', value: date || '' }] : []),
		...(shouldShowField('startDate') ? [{ key: 'Start date', value: startDate || '' }] : []),
		...(shouldShowField('endDate') ? [{ key: 'End date', value: endDate || '' }] : []),
		...(shouldShowField('startTime') ? [{ key: 'Start time', value: startTime || '' }] : []),
		...(shouldShowField('endTime') ? [{ key: 'End time', value: endTime || '' }] : []),
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

/**
 *
 * @param {ApplicationsTimetable} timetableItem
 * @returns {Record<string, any>}
 */
const getTimetableRows = (timetableItem) => {
	const { id, description, name, ExaminationTimetableType, date, startDate, startTime, endTime } =
		timetableItem;

	const templateType = ExaminationTimetableType?.templateType;

	const shouldShowField = (/** @type {string} */ fieldName) =>
		Object.prototype.hasOwnProperty.call(timetableTemplatesSchema[templateType || 0], fieldName);

	return {
		id,
		itemTypeName: ExaminationTimetableType?.name,
		name,
		date: shouldShowField('date') ? displayDate(date, { condensed: true }) || '' : null,
		startDate:
			shouldShowField('startDate') && startDate
				? displayDate(startDate, { condensed: true }) || ''
				: null,
		endDate: shouldShowField('endDate') ? displayDate(date, { condensed: true }) || '' : null,
		startTime: shouldShowField('startTime') ? startTime || '' : null,
		endTime: shouldShowField('endTime') ? endTime || '' : null,
		description: JSON.parse(description)
	};
};
