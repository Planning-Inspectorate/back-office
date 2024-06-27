import { getAllCaseKeyDates, updateKeyDates } from './applications-key-dates.service.js';
import {
	isRelevantRepresentationsReOpened,
	getProjectFormLink
} from './applications-key-dates.utils.js';

/**
 * View the index of all the case key dates
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewKeyDatesIndex(request, response) {
	const { caseId, case: projectData } = response.locals;

	const sections = await getAllCaseKeyDates(+caseId);

	const {
		preExamination: { dateOfReOpenRelevantRepresentationClose }
	} = sections;

	return response.render(`applications/case-key-dates/key-dates-index.njk`, {
		sections,
		selectedPageType: 'key-dates',
		isRelevantRepresentationsReOpened: isRelevantRepresentationsReOpened(
			dateOfReOpenRelevantRepresentationClose
		),
		projectFormLink: getProjectFormLink(projectData)
	});
}

/**
 * View page to edit key dates for a specific section
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {sectionName: string}>}
 */
export async function viewKeyDatesEditSection({ params }, response) {
	const { sectionName } = params;
	const { caseId } = response.locals;

	const sections = await getAllCaseKeyDates(+caseId);

	return response.render(`applications/case-key-dates/key-dates-section.njk`, {
		sectionName,
		sectionValues: sections[sectionName] || {}
	});
}

/**
 * Update key dates for a specific section
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, Record<string, string>, {}, {sectionName: string}>}
 */
export async function updateKeyDatesSection({ params, body, errors: validationErrors }, response) {
	const { sectionName } = params;
	const { caseId } = response.locals;

	/** @type {Record<string, string|number>} */
	let payload = body;
	let validDates = {};
	let apiErrors;

	// get all fields
	// they could be inferred by the API but this way we avoid an API call
	const allDateFields = Object.keys(body)
		.filter((key) => key.indexOf('year') > 1)
		.map((key) => key.replace('.year', ''));

	// transform {field.day:1, field.month:2, field.year: 1990} to {field: 1234567}
	allDateFields.forEach((dateField) => {
		const day = body[`${dateField}.day`];
		const month = body[`${dateField}.month`];
		const year = body[`${dateField}.year`];

		if (validationErrors && validationErrors[dateField]) {
			validationErrors[dateField].value = { day, month, year };
		} else {
			const date = new Date(`${year}-${month}-${day}`);

			const unixTimeStamp = Math.floor(date.getTime() / 1000);

			if (!isNaN(unixTimeStamp)) {
				// @ts-ignore
				validDates[dateField] = unixTimeStamp;
			}
		}
	});

	if (!validationErrors) {
		const { errors } = await updateKeyDates(+caseId, {
			[sectionName]: { ...payload, ...validDates }
		});
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const sections = await getAllCaseKeyDates(caseId);

		return response.render(`applications/case-key-dates/key-dates-section.njk`, {
			sectionName,
			sectionValues: { ...sections[sectionName], ...validDates } || {},
			errors: validationErrors || apiErrors
		});
	}

	return response.redirect(`../key-dates`);
}
