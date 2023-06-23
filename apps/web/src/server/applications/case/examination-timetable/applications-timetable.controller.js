import { dateString, displayDate } from '../../../lib/nunjucks-filters/date.js';
import { mapExaminationTimetableToFormBody } from './applications-timetable.mappers.js';
import {
	createCaseTimetableItem,
	getCaseTimetableItemTypes,
	getCaseTimetableItems,
	publishCaseTimetableItems,
	getCaseTimetableItemById,
	deleteCaseTimetableItem,
	updateCaseTimetableItem,
	getCaseTimetableItemTypeByName
} from './applications-timetable.service.js';

/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetableCreateBody} ApplicationsTimetableCreateBody */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetablePayload} ApplicationsTimetablePayload */
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
 * View the list of examination timetables for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Record<string, any>, publishedStatus: boolean}>}
 */
export async function viewApplicationsCaseTimetableList(_, response) {
	const timetableItems = await getCaseTimetableItems(response.locals.caseId);

	const timetableItemsViewData = timetableItems.map((timetableItem) =>
		getTimetableRows(timetableItem)
	);
	const publishedStatus = timetableItems?.length > 0 && timetableItems[0]?.published;

	response.render(`applications/case-timetable/timetable-list`, {
		timetableItems: timetableItemsViewData,
		publishedStatus
	});
}

/**
 * View the preview page of the examination timetables for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Array<Record<string, any>>, backLink: string}>}
 */
export async function viewApplicationsCaseTimetablesPreview(_, response) {
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
 * Publish the examination timetables
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function publishApplicationsCaseTimetables(_, response) {
	const { errors } = await publishCaseTimetableItems(response.locals.caseId);

	if (errors) {
		const timetableItems = await getCaseTimetableItems(response.locals.caseId);

		const timetableItemsViewData = timetableItems.map((timetableItem) =>
			getTimetableRows(timetableItem)
		);

		return response.render(`applications/case-timetable/timetable-preview.njk`, {
			timetableItems: timetableItemsViewData,
			errors,
			backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`
		});
	}

	response.redirect(`./published/success`);
}

/**
 * View the delete page for the examination timetable for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItem: Record<string, string>}, {}, {}, {}, {timetableId: string}>}
 */
export async function viewApplicationsCaseTimetableDelete(request, response) {
	const timetableItem = await getCaseTimetableItemById(+request.params.timetableId);
	const timetableItemViewData = getTimetableRows(timetableItem);

	response.render(`applications/case-timetable/timetable-delete.njk`, {
		timetableItem: timetableItemViewData
	});
}

/**
 * Delete one the examination timetable or render errors
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {timetableId: string}>}
 */
export async function deleteApplicationsCaseTimetable(request, response) {
	const { errors } = await deleteCaseTimetableItem(+request.params.timetableId);

	if (errors) {
		const timetableItem = await getCaseTimetableItemById(+request.params.timetableId);
		const timetableItemViewData = getTimetableRows(timetableItem);

		return response.render(`applications/case-timetable/timetable-delete.njk`, {
			timetableItem: timetableItemViewData,
			errors
		});
	}

	response.redirect('../../deleted/success');
}
/**
 * Set the type for a new examination timetable (1st step)
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
 * Show the details form template for the new examination timetable (2nd step)
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {timetableId: string, 'timetable-type': string}, {}, {}>}
 */
export async function viewApplicationsCaseTimetableDetailsNew({ body }, response) {
	const selectedItemTypeName = body['timetable-type'];

	const selectedItemType = await getCaseTimetableItemTypeByName(selectedItemTypeName);

	const templateFields = timetableTemplatesSchema[selectedItemType.templateType];

	return response.render(`applications/case-timetable/timetable-details-form.njk`, {
		selectedItemType,
		templateFields,
		values: body,
		isEditing: !!body.timetableId
	});
}

/**
 * Edit an existing examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {timetableId: string}>}
 */
export async function viewApplicationsCaseTimetableDetailsEdit({ params }, response) {
	const timetableItem = await getCaseTimetableItemById(+params.timetableId);

	const selectedItemType = timetableItem.ExaminationTimetableType;
	const templateFields = timetableTemplatesSchema[selectedItemType.templateType];

	const values = mapExaminationTimetableToFormBody(
		timetableItem,
		selectedItemType.id,
		selectedItemType.name
	);

	return response.render(`applications/case-timetable/timetable-details-form.njk`, {
		isEditing: true,
		values,
		templateFields,
		selectedItemType
	});
}

/**
 * Handle the details form for the new/editing examination timetable (3th step)
 * This is triggered by the "validate" url in the details form
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function postApplicationsCaseTimetableDetails(
	{ errors: validationErrors, body },
	response
) {
	if (validationErrors) {
		const selectedItemType = await getCaseTimetableItemTypeByName(body.itemTypeName);
		const templateFields = timetableTemplatesSchema[selectedItemType.templateType];
		return response.render(`applications/case-timetable/timetable-details-form.njk`, {
			errors: validationErrors,
			values: body,
			selectedItemType,
			templateFields
		});
	}

	// the 307 redirect allows to redirect keeping the method "POST" and its body
	return response.redirect(307, `../check-your-answers/${body.timetableId ?? null}`);
}

/**
 * Check your answers page for the new/edited examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {}>}
 */
export async function postApplicationsCaseTimetableCheckYourAnswers({ body }, response) {
	const rows = getCheckYourAnswersRows(body);

	response.render(`applications/case-timetable/timetable-check-your-answers.njk`, {
		rows,
		values: body,
		isEditing: !!body.timetableId
	});
}

/**
 * Save new/edited examination timetable
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

	/** @type {ApplicationsTimetablePayload} */
	const payload = {
		caseId: response.locals.caseId,
		examinationTypeId: Number.parseInt(body['timetableTypeId'], 10),
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
	if (body['timetableId']) {
		payload.id = Number.parseInt(body['timetableId'], 10);
	}

	let errors;
	if (payload.id) {
		// has exam id, therefore an existing record for update
		const apiResponse = await updateCaseTimetableItem(payload);
		errors = apiResponse.errors;
	} else {
		// create new record
		const apiResponse = await createCaseTimetableItem(payload);
		errors = apiResponse.errors;
	}

	if (errors) {
		const rows = getCheckYourAnswersRows(body);
		return response.render(`applications/case-timetable/timetable-check-your-answers.njk`, {
			isEditing: !!payload.id,
			rows,
			values: body,
			errors
		});
	}

	response.redirect(`../../${payload.id ? 'edited' : 'created'}/success`);
}

/**
 * Success banner when successfully publishing an examination timetable
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {action: string}>}
 */
export async function viewApplicationsCaseTimetableSuccessBanner(request, response) {
	// action can be 'edited', 'published', 'created'

	response.render('applications/case-timetable/timetable-success-banner.njk', {
		action: request.params.action
	});
}

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
		Object.prototype.hasOwnProperty.call(timetableTemplatesSchema[templateType], fieldName);

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
