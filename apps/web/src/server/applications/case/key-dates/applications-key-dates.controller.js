import { getAllCaseKeyDates, updateKeyDates } from './applications-key-dates.service.js';
import {
	isRelevantRepresentationsReOpened,
	getProjectFormLink
} from './applications-key-dates.utils.js';

/**
 * @param {Record<string, any>} sections - The original sections object
 * @returns {Record<string, any>}  sections with grouped preApplication subsections
 */
function splitPreApplicationSection(sections) {
	if (!sections?.preApplication) {
		return sections;
	}

	const preApplicationData = sections.preApplication;

	const preApplicationFields = [
		'datePINSFirstNotifiedOfProject',
		'dateProjectAppearsOnWebsite',
		'submissionAtPublished',
		'submissionAtInternal',
		'section46Notification'
	];

	const screeningAndScopingFields = [
		'screeningOpinionSought',
		'screeningOpinionIssued',
		'scopingOpinionSought',
		'scopingOpinionIssued'
	];

	/** @type {Record<string, any>} */
	const modifiedPreApplication = {};
	/** @type {Record<string, any>} */
	const screeningAndScoping = {};

	preApplicationFields.forEach((field) => {
		if (preApplicationData[field] !== undefined) {
			modifiedPreApplication[field] = preApplicationData[field];
		}
	});

	screeningAndScopingFields.forEach((field) => {
		if (preApplicationData[field] !== undefined) {
			screeningAndScoping[field] = preApplicationData[field];
		}
	});

	const result = Object.assign({}, sections);
	delete result.preApplication;

	return {
		preApplication: {
			preApplicationSection: modifiedPreApplication,
			screeningAndScoping
		},
		...result
	};
}

/**
 * Get the actual API section name for virtual sections
 * @param {string} sectionName
 * @returns {string}
 */
function getApiSectionName(sectionName) {
	if (sectionName === 'preApplicationSection' || sectionName === 'screeningAndScoping') {
		return 'preApplication';
	}
	return sectionName;
}

/**
 * View the index of all the case key dates
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewKeyDatesIndex(request, response) {
	const { caseId, case: projectData } = response.locals;

	const sections = await getAllCaseKeyDates(+caseId);

	const modifiedSections = splitPreApplicationSection(sections);

	const {
		preExamination: { dateOfReOpenRelevantRepresentationClose }
	} = sections;

	return response.render(`applications/case-key-dates/key-dates-index.njk`, {
		sections: modifiedSections,
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
	const modifiedSections = splitPreApplicationSection(sections);
	let targetSectionName = sectionName;
	/** @type {Record<string, any>} */
	let sectionValues = {};

	if (sectionName === 'preApplicationSection' || sectionName === 'screeningAndScoping') {
		sectionValues = modifiedSections.preApplication?.[sectionName] || {};
	} else if (sectionName === 'preApplication') {
		targetSectionName = 'preApplicationSection';
		sectionValues = modifiedSections.preApplication?.preApplicationSection || {};
	} else {
		sectionValues = modifiedSections[sectionName] || {};
	}

	return response.render(`applications/case-key-dates/key-dates-section.njk`, {
		sectionName: targetSectionName,
		sectionValues: sectionValues
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
	/** @type {Record<string, number>} */
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
				validDates[dateField] = unixTimeStamp;
			}
		}
	});

	if (!validationErrors) {
		// Use the actual API section name for updates
		const apiSectionName = getApiSectionName(sectionName);
		const { errors } = await updateKeyDates(+caseId, {
			[apiSectionName]: { ...payload, ...validDates }
		});
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const sections = await getAllCaseKeyDates(caseId);
		const modifiedSections = splitPreApplicationSection(sections);

		let targetSectionName = sectionName;
		/** @type {Record<string, any>} */
		let sectionValues = {};

		if (sectionName === 'preApplicationSection' || sectionName === 'screeningAndScoping') {
			sectionValues = modifiedSections.preApplication?.[sectionName] || {};
		} else if (sectionName === 'preApplication') {
			targetSectionName = 'preApplicationSection';
			sectionValues = modifiedSections.preApplication?.preApplicationSection || {};
		} else {
			sectionValues = modifiedSections[sectionName] || {};
		}

		return response.render(`applications/case-key-dates/key-dates-section.njk`, {
			sectionName: targetSectionName,
			sectionValues: { ...sectionValues, ...validDates },
			errors: validationErrors || apiErrors
		});
	}

	return response.redirect(`../key-dates`);
}
