import { dateString, displayDate } from '../../../lib/nunjucks-filters/date.js';
import {
	convertExamDescriptionToInputText,
	mapExaminationTimetableToFormBody
} from './applications-timetable.mappers.js';
import {
	createCaseTimetableItem,
	getCaseTimetableItemTypes,
	getCaseTimetableItems,
	publishCaseTimetableItems,
	unpublishCaseTimetableItems,
	getCaseTimetableItemById,
	deleteCaseTimetableItem,
	updateCaseTimetableItem,
	getCaseTimetableItemTypeByName,
	getCaseTimetableItemTypeById
} from './applications-timetable.service.js';
import pino from '../../../lib/logger.js';
import sanitizeHtml from 'sanitize-html';
import { isCaseRegionWales } from '../../common/isCaseWelsh.js';
import {
	deleteSessionBanner,
	getSessionBanner,
	setSessionBanner
} from '../../common/services/session.service.js';

/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetableCreateBody} ApplicationsTimetableCreateBody */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetablePayload} ApplicationsTimetablePayload */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetable} ApplicationsTimetable */
/** @typedef {import('./applications-timetable.types.js').ApplicationExaminationTimetableItem} ApplicationExaminationTimetableItem */

/** @type {Record<string, Record<string, boolean>>} */
export const timetableTemplatesSchema = {
	'accompanied-site-inspection': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'compulsory-acquisition-hearing': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	deadline: {
		name: true,
		startDate: false,
		endDate: true,
		startTime: false,
		endTime: true,
		description: true
	},
	'deadline-for-close-of-examination': {
		name: true,
		startDate: false,
		endDate: true,
		startTime: false,
		endTime: true,
		description: false
	},
	'issued-by': {
		name: true,
		date: true,
		description: false
	},
	'issue-specific-hearing': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'open-floor-hearing': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'other-meeting': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'preliminary-meeting': {
		name: true,
		date: true,
		startTime: true,
		endTime: false,
		description: false
	},
	'procedural-deadline': {
		name: true,
		startDate: false,
		endDate: true,
		startTime: false,
		endTime: true,
		description: true
	},
	'procedural-decision': {
		name: true,
		date: true,
		startTime: false,
		endTime: false,
		description: false
	},
	'publication-of': {
		name: true,
		date: true,
		description: false
	}
};

/**
 * View the list of examination timetables for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Record<string, any>, publishedStatus: boolean, selectedPageType: string, republishStatus: boolean, isCaseWelsh: boolean, successBannerText: string | undefined}>}
 */
export async function viewApplicationsCaseTimetableList({ session }, response) {
	const examinationTimetable = await getCaseTimetableItems(response.locals.caseId);
	const timetableItemsViewData = examinationTimetable?.items?.map(getTimetableRows) ?? [];
	const republishStatus =
		examinationTimetable.updatedAt > examinationTimetable.publishedAt ||
		examinationTimetable.items?.some((item) => item.createdAt > examinationTimetable.publishedAt);

	const isCaseWelsh = isCaseRegionWales(response.locals.case?.geographicalInformation?.regions);
	const successBannerText = getSessionBanner(session);
	deleteSessionBanner(session);

	response.render(`applications/case-timetable/timetable-list`, {
		timetableItems: timetableItemsViewData,
		publishedStatus: examinationTimetable?.published,
		selectedPageType: 'examination-timetable',
		republishStatus,
		isCaseWelsh,
		successBannerText
	});
}

/**
 * View the preview page of the examination timetables for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Array<Record<string, any>>, backLink: string, stage: string, isCaseWelsh: boolean}>}
 */
export async function viewApplicationsCaseTimetablesPreview(_, response) {
	const timetableItems = await getCaseTimetableItems(response.locals.caseId);
	const isCaseWelsh = isCaseRegionWales(response.locals.case?.geographicalInformation?.regions);

	const timetableItemsViewData = timetableItems?.items?.map((timetableItem) =>
		getTimetableRows(timetableItem)
	);

	response.render(`applications/case-timetable/timetable-preview.njk`, {
		timetableItems: timetableItemsViewData,
		backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`,
		stage: 'publish',
		isCaseWelsh
	});
}

/**
 * View the unpublish preview page of the examination timetables for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItems: Array<Record<string, any>>, backLink: string, stage: string, isCaseWelsh: boolean}>}
 */
export async function viewApplicationsCaseTimetablesUnpublishPreview(_, response) {
	const timetableItems = await getCaseTimetableItems(response.locals.caseId);
	const isCaseWelsh = isCaseRegionWales(response.locals.case?.geographicalInformation?.regions);

	const timetableItemsViewData = timetableItems?.items?.map((timetableItem) =>
		getTimetableRows(timetableItem)
	);

	response.render(`applications/case-timetable/timetable-preview.njk`, {
		timetableItems: timetableItemsViewData,
		backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`,
		stage: 'unpublish',
		isCaseWelsh
	});
}

/**
 * Publish the examination timetables
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function publishApplicationsCaseTimetables(_, response) {
	const {
		locals: { caseIsWelsh, caseId }
	} = response;
	const timetableItems = await getCaseTimetableItems(caseId);

	let errors = {};
	if (caseIsWelsh) {
		//we shouldn't publish a timetable for a welsh case without welsh name
		errors = validateWelshNameBeforePublish(timetableItems.items)
			? { ...generateExamTimetablePublishingErrors(timetableItems.items) }
			: {};
	}

	errors = {
		...errors,
		...(await publishCaseTimetableItems(response.locals.caseId)).errors
	};

	if (Object.keys(errors).length) {
		const timetableItemsViewData = timetableItems?.items?.map((timetableItem) =>
			getTimetableRows(timetableItem)
		);

		return response.render(`applications/case-timetable/timetable-preview.njk`, {
			timetableItems: timetableItemsViewData,
			errors,
			stage: 'publish',
			backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`,
			isCaseWelsh: caseIsWelsh
		});
	}

	response.redirect(`./published/success`);
}

/**
 * Unpublish the examination timetables
 *
 * @type {import('@pins/express').RenderHandler<{}>}
 */
export async function unpublishApplicationsCaseTimetables(_, response) {
	const { errors } = await unpublishCaseTimetableItems(response.locals.caseId);

	if (errors) {
		const timetableItems = await getCaseTimetableItems(response.locals.caseId);

		const timetableItemsViewData = timetableItems?.items?.map((timetableItem) =>
			getTimetableRows(timetableItem)
		);

		return response.render(`applications/case-timetable/timetable-preview.njk`, {
			timetableItems: timetableItemsViewData,
			errors,
			backLink: `/applications-service/case/${response.locals.caseId}/examination-timetable`
		});
	}

	response.redirect(`./unpublished/success`);
}

/**
 * View the delete page for the examination timetable for a single case
 *
 * @type {import('@pins/express').RenderHandler<{timetableItem: Record<string, string>, isCaseWelsh: boolean}, {}, {}, {}, {timetableId: string}>}
 */
export async function viewApplicationsCaseTimetableDelete(request, response) {
	const timetableItem = await getCaseTimetableItemById(+request.params.timetableId);
	const isCaseWelsh = isCaseRegionWales(response.locals.case?.geographicalInformation?.regions);

	if (timetableItem.submissions) {
		pino.error(
			`[WEB] Cannot delete Examination Timetable ${+request.params.timetableId}: submissions found`
		);

		return response.render('app/500.njk');
	}

	const timetableItemViewData = getTimetableRows(timetableItem);

	response.render(`applications/case-timetable/timetable-delete.njk`, {
		timetableItem: timetableItemViewData,
		isCaseWelsh
	});
}

/**
 * Delete one examination timetable or render errors
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
 * Show the details-form for the new examination timetable (2nd step)
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

	if (timetableItem.submissions) {
		pino.error(`[WEB] Cannot edit Examination Timetable ${params.timetableId}: submissions found`);
		return response.render('app/500.njk');
	}

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
	return response.redirect(307, `../check-your-answers/${body.timetableId ?? ''}`);
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
		description: prepareDescriptionPayload(body.description),
		date,
		startDate,
		startTime: body['startTime.hours']
			? `${body['startTime.hours']}:${body['startTime.minutes']}`
			: null,
		endTime: body['endTime.hours'] ? `${body['endTime.hours']}:${body['endTime.minutes']}` : null
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
		// need to repopulate the item type info into body
		const selectedItemType = await getCaseTimetableItemTypeById(Number(body.timetableTypeId));
		body.itemTypeName = selectedItemType.name;
		body.templateType = selectedItemType.templateType;
		// need to copy timetableTypeId into templateId, as that is the value that the check-your-answers page expects,
		// otherwise the type value is lost
		body.templateId = body.timetableTypeId;

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
 * view examination timetable item-welsh name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {timetableId: string}>}
 */
export async function viewApplicationsCaseTimetableItemNameWelsh({ params }, response) {
	const { timetableId } = params;
	const { name, nameWelsh, submissions } = await getCaseTimetableItemById(+timetableId);

	// if there are submissions against timetable item, we shouldn't edit it
	if (submissions) {
		pino.error(`[WEB] Cannot edit Examination Timetable ${params.timetableId}: submissions found`);
		return response.render('app/500.njk');
	}

	return response.render('applications/case-timetable/timetable-item-name-welsh.njk', {
		itemName: name,
		itemNameWelsh: nameWelsh,
		pageTitle: 'Item name in Welsh'
	});
}

/**
 * create/edit examination timetable item-welsh name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {timetableId: string}>}
 */
export async function postApplicationsCaseTimetableItemNameWelsh(
	{ params, body, baseUrl, errors, session },
	response
) {
	const { timetableId } = params;
	const { name, submissions } = await getCaseTimetableItemById(+timetableId);

	// if there are submissions, we shouldn't edit the item
	if (submissions) {
		pino.error(`[WEB] Cannot edit Examination Timetable ${timetableId}: submissions found`);
		return response.render('app/500.njk');
	}

	if (errors) {
		return response.render('applications/case-timetable/timetable-item-name-welsh.njk', {
			itemName: name,
			itemNameWelsh: errors.nameWelsh.value,
			pageTitle: 'Item name in Welsh',
			errors
		});
	}

	/** @type {ApplicationsTimetablePayload} */
	const payload = {
		id: +timetableId,
		nameWelsh: body.nameWelsh
	};

	await updateCaseTimetableItem(payload);

	//on update, return to examination timetable and display success banner
	setSessionBanner(session, 'Item name in Welsh updated');
	return response.redirect(`${baseUrl}`);
}

/**
 * view examination timetable item- welsh description
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {timetableId: string}>}
 */
export async function viewApplicationsCaseTimetableItemDescriptionWelsh({ params }, response) {
	const { timetableId } = params;
	const { description, descriptionWelsh, submissions } = await getCaseTimetableItemById(
		+timetableId
	);

	// if there are submissions against timetable item, we shouldn't edit it
	if (submissions) {
		pino.error(`[WEB] Cannot edit Examination Timetable ${timetableId}: submissions found`);
		return response.render('app/500.njk');
	}

	return response.render('applications/case-timetable/timetable-item-description-welsh.njk', {
		itemDescription: JSON.parse(description),
		itemDescriptionWelsh: convertExamDescriptionToInputText(descriptionWelsh),
		pageTitle: 'Item description in Welsh'
	});
}

/**
 * create/edit examination timetable item-welsh description
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, ApplicationsTimetableCreateBody, {}, {timetableId: string}>}
 */
export async function postApplicationsCaseTimetableItemDescriptionWelsh(
	{ params, body, baseUrl, errors, session },
	response
) {
	const { timetableId } = params;
	const { description, submissions } = await getCaseTimetableItemById(+params.timetableId);

	// if there are submissions against timetable item, we shouldn't edit it
	if (submissions) {
		pino.error(`[WEB] Cannot edit Examination Timetable ${timetableId}: submissions found`);
		return response.render('app/500.njk');
	}

	if (!validateWelshItemDescriptionBulletPoints(description, body.descriptionWelsh)) {
		errors = {
			descriptionWelsh: {
				value: body.descriptionWelsh,
				msg: 'Item description in Welsh must contain the same number of bullets as the item description in English',
				param: 'descriptionWelsh',
				location: 'body'
			},
			...errors //errors from validator should supersede bullet point error
		};
	}

	if (errors) {
		return response.render('applications/case-timetable/timetable-item-description-welsh.njk', {
			itemDescription: JSON.parse(description),
			itemDescriptionWelsh: body.descriptionWelsh,
			pageTitle: 'Item description in Welsh',
			errors
		});
	}

	/** @type {ApplicationsTimetablePayload} */
	const payload = {
		id: +timetableId,
		descriptionWelsh: prepareDescriptionPayload(body.descriptionWelsh)
	};

	await updateCaseTimetableItem(payload);

	//on update, return to examination timetable and display success banner
	setSessionBanner(session, 'Item description in Welsh updated');
	return response.redirect(`${baseUrl}`);
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
 * @returns {{key: {text: string}, value: {html?: string} | {text?: string}}[]}
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

	/** @type {{key: string, text?: string, html?: string}[]} */
	const rowsItems = [
		{ key: 'Item type', text: itemTypeName },
		{ key: 'Item name', text: name },
		...(shouldShowField('date') ? [{ key: 'Date', text: date || '' }] : []),
		...(shouldShowField('startDate') ? [{ key: 'Start date', text: startDate || '' }] : []),
		...(shouldShowField('endDate') ? [{ key: 'End date', text: endDate || '' }] : []),
		...(shouldShowField('startTime') ? [{ key: 'Start time', text: startTime || '' }] : []),
		...(shouldShowField('endTime') ? [{ key: 'End time', text: endTime || '' }] : []),
		{
			key: 'Timetable item description',
			html: (sanitizeHtml(description, {}) || '')
				.replace(/\*/g, '&middot;')
				.replace(/\n/g, '<br />')
		}
	];

	return rowsItems.map((rowItem) => {
		const key = { text: rowItem.key };
		const value = rowItem.html ? { html: rowItem.html } : { text: rowItem.text };
		return { key, value };
	});
};

/**
 *
 * @param {ApplicationExaminationTimetableItem} timetableItem
 * @returns {Record<string, any>}
 */
const getTimetableRows = (timetableItem) => {
	const {
		id,
		description,
		descriptionWelsh,
		submissions,
		name,
		nameWelsh,
		ExaminationTimetableType,
		date,
		startDate,
		startTime,
		endTime
	} = timetableItem;

	const templateType = ExaminationTimetableType.templateType;

	if (!templateType) {
		throw new Error(
			`Template type not found for timetable item type ${ExaminationTimetableType?.name}`
		);
	}

	const shouldShowField = (/** @type {string} */ fieldName) =>
		Object.prototype.hasOwnProperty.call(timetableTemplatesSchema[templateType], fieldName);

	const startDateDisplay = () => {
		if (shouldShowField('startDate')) {
			if (startDate) {
				return displayDate(startDate, { condensed: true });
			} else {
				return '';
			}
		}
		return null;
	};

	return {
		id,
		itemTypeName: ExaminationTimetableType.name,
		templateType: templateType,
		name,
		nameWelsh,
		submissions,
		date: shouldShowField('date') ? displayDate(date, { condensed: true }) || '' : null,
		startDate: startDateDisplay(),
		endDate: shouldShowField('endDate') ? displayDate(date, { condensed: true }) || '' : null,
		startTime: shouldShowField('startTime') ? startTime || '' : null,
		endTime: shouldShowField('endTime') ? endTime || '' : null,
		description: description ? JSON.parse(description) : null,
		descriptionWelsh: descriptionWelsh ? JSON.parse(descriptionWelsh) : null
	};
};

/**
 * Prepare the payload for the description
 * @param {string|undefined} descriptionBody
 * @returns {string}
 */
const prepareDescriptionPayload = (descriptionBody) => {
	if (typeof descriptionBody !== 'string') {
		throw new Error('Description body must be a string');
	}
	const splitDescription = sanitizeHtml(descriptionBody, {}).split('*');
	const preText = splitDescription.shift();
	const bulletPoints = splitDescription;

	return JSON.stringify({ preText, bulletPoints });
};

/**
 * Validate the welsh and english timetable item descriptions to both have the same number of bulletpoints
 * @param {string} englishDescription
 * @param {string|undefined} welshDescriptionBody
 * @returns {boolean}
 */
const validateWelshItemDescriptionBulletPoints = (englishDescription, welshDescriptionBody) => {
	const { bulletPoints: englishBulletPointsArr } = JSON.parse(englishDescription);

	const welshDescription = prepareDescriptionPayload(welshDescriptionBody);
	const { bulletPoints: welshBulletPointsArr } = JSON.parse(welshDescription);

	return englishBulletPointsArr.length === welshBulletPointsArr.length;
};

/**
 * Validate the welsh timetable item names to have a value before publishing
 * @param {Array<ApplicationExaminationTimetableItem>} timetableItems
 * @returns {boolean}
 */
const validateWelshNameBeforePublish = (timetableItems) =>
	timetableItems.some((item) => !item.nameWelsh || item.nameWelsh.trim() === '');

/**
 * Create errors object to be passed to the template
 * @param {Array<ApplicationExaminationTimetableItem>} timetableItems
 */
const generateExamTimetablePublishingErrors = (timetableItems) => {
	/** @type {Record<string, {msg: string}>}*/
	const errors = {};
	timetableItems.forEach((item) => {
		if (!item.nameWelsh || item.nameWelsh.trim() === '') {
			errors[`nameWelsh-${item.id}`] = {
				msg: `Enter examination timetable item name in welsh - ${item.name}`
			};
		}
	});
	return errors;
};
