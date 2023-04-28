import { getCaseTimetableItemTypes } from './applications-timetable.service.js';

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
	const selectedItemTypeName = request.body['timetable-type'];
	const formProperties = await getCreateTimetableFormProperties(selectedItemTypeName);

	if (formProperties) {
		return response.render(
			`applications/case-timetable/timetable-new-item-details.njk`,
			formProperties
		);
	}

	response.render(`app/500.njk`);
}

/**
 * Handle the new examination timetable details form
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {itemTypeName: string}, {}, {}>}
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

	return response.redirect(`../check-your-answers`);
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
			templateType: selectedItemType.templateType
		};
		const templateFields = timetableTemplatesSchema[selectedItemType.templateType];

		return { selectedItemType: formattedSelectedItemType, templateFields };
	}

	return null;
};
