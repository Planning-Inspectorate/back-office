import { getCaseTimetableItemTypes } from './applications-timetable.service.js';

/**
 * View the examination timetable page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewApplicationsCaseExaminationTimeTable(request, response) {
	response.render(`applications/case/examination-timetable`, {
		selectedPageType: 'examination-timetable'
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
	const timetableItems = await getCaseTimetableItemTypes();
	const selectedItemType = request.body['timetable-type'];

	const selectedTemplateType = timetableItems.find(
		(timetableType) => timetableType.name === selectedItemType
	)?.templateType;

	if (selectedTemplateType) {
		return response.render(`applications/case-timetable/timetable-new-item-details.njk`, {
			selectedItemType,
			selectedTemplateType
		});
	}

	response.render(`app/500.njk`);
}

/**
 * Handle the new examination timetable details form
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {templateType: string, itemType: string}, {}, {}>}
 */
export async function postApplicationsCaseTimetableDetails(
	{ errors: validationErrors, body },
	response
) {
	const { templateType: selectedTemplateType, itemType: selectedItemType } = body;

	if (validationErrors) {
		return response.render(`applications/case-timetable/timetable-new-item-details.njk`, {
			errors: validationErrors,
			values: body,
			selectedItemType,
			selectedTemplateType
		});
	}

	return response.redirect(`/`);
}
