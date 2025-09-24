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
 * @param {Record<string, any>} sections - The original sections object
 * @returns {Record<string, any>} sections with grouped preExamination subsections
 */
function splitPreExaminationSection(sections) {
	if (!sections?.preExamination) {
		return sections;
	}

	const preExaminationData = sections.preExamination;

	const relevantRepresentationsFields = [
		'dateOfRepresentationPeriodOpen',
		'dateOfRelevantRepresentationClose',
		'extensionToDateRelevantRepresentationsClose',
		'dateRRepAppearOnWebsite'
	];

	const relevantRepresentationsReOpenFields = [
		'dateOfReOpenRelevantRepresentationStart',
		'dateOfReOpenRelevantRepresentationClose'
	];

	const otherDatesFields = [
		'dateIAPIDue',
		'rule6LetterPublishDate',
		'preliminaryMeetingStartDate',
		'notificationDateForPMAndEventsDirectlyFollowingPM',
		'notificationDateForEventsApplicant'
	];

	const relevantRepresentations = /** @type {Record<string, any>} */ ({});
	const relevantRepresentationsReOpen = /** @type {Record<string, any>} */ ({});
	const otherDates = /** @type {Record<string, any>} */ ({});

	relevantRepresentationsFields.forEach((field) => {
		if (preExaminationData[field] !== undefined) {
			relevantRepresentations[field] = preExaminationData[field];
		}
	});

	relevantRepresentationsReOpenFields.forEach((field) => {
		if (preExaminationData[field] !== undefined) {
			relevantRepresentationsReOpen[field] = preExaminationData[field];
		}
	});

	otherDatesFields.forEach((field) => {
		if (preExaminationData[field] !== undefined) {
			otherDates[field] = preExaminationData[field];
		}
	});

	const result = Object.assign({}, sections);
	delete result.preExamination;

	return {
		...result,
		preExamination: {
			relevantRepresentations,
			relevantRepresentationsReOpen,
			otherDates
		}
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
	if (
		sectionName === 'relevantRepresentations' ||
		sectionName === 'relevantRepresentationsReOpen' ||
		sectionName === 'otherDates'
	) {
		return 'preExamination';
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

	const modifiedSections = splitPreApplicationSection(splitPreExaminationSection(sections));

	const orderedSectionKeys = ['preApplication', 'acceptance', 'preExamination'];
	const orderedSections = /** @type {Record<string, any>} */ ({});

	orderedSectionKeys.forEach((key) => {
		if (modifiedSections[key]) {
			orderedSections[key] = modifiedSections[key];
		}
	});

	Object.keys(modifiedSections).forEach((key) => {
		if (!orderedSectionKeys.includes(key)) {
			orderedSections[key] = modifiedSections[key];
		}
	});

	const { preExamination: { dateOfReOpenRelevantRepresentationClose = undefined } = {} } = sections;

	return response.render(`applications/case-key-dates/key-dates-index.njk`, {
		sections: orderedSections,
		selectedPageType: 'key-dates',
		isRelevantRepresentationsReOpened: isRelevantRepresentationsReOpened(
			dateOfReOpenRelevantRepresentationClose || ''
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
	const modifiedSections = splitPreApplicationSection(splitPreExaminationSection(sections));
	let targetSectionName = sectionName;
	/** @type {Record<string, any>} */
	let sectionValues;
	let mainHeading = null;
	let subHeading = null;

	if (sectionName === 'preApplicationSection' || sectionName === 'screeningAndScoping') {
		sectionValues = modifiedSections.preApplication?.[sectionName] || {};
	} else if (sectionName === 'relevantRepresentations') {
		sectionValues = modifiedSections.preExamination?.[sectionName] || {};
		mainHeading = 'Pre-examination dates';
		subHeading = 'Relevant representations';
	} else if (sectionName === 'relevantRepresentationsReOpen') {
		sectionValues = modifiedSections.preExamination?.[sectionName] || {};
		mainHeading = 'Relevant representations re-open';
		subHeading = null;
	} else if (sectionName === 'otherDates') {
		sectionValues = modifiedSections.preExamination?.[sectionName] || {};
	} else if (sectionName === 'preApplication') {
		targetSectionName = 'preApplicationSection';
		sectionValues = modifiedSections.preApplication?.preApplicationSection || {};
	} else {
		sectionValues = modifiedSections[sectionName] || {};
	}

	return response.render(`applications/case-key-dates/key-dates-section.njk`, {
		sectionName: targetSectionName,
		sectionValues: sectionValues,
		mainHeading: mainHeading,
		subHeading: subHeading
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

	/**
	 * @param {Record<string, any>} obj
	 * @returns {Record<string, any>}
	 */
	function removeUndefined(obj) {
		return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
	}

	if (!validationErrors) {
		// Use the actual API section name for updates
		const apiSectionName = getApiSectionName(sectionName);
		const cleanedPayload = removeUndefined({ ...payload, ...validDates });
		const { errors } = await updateKeyDates(+caseId, {
			[apiSectionName]: cleanedPayload
		});
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const sections = await getAllCaseKeyDates(caseId);
		const modifiedSections = splitPreApplicationSection(splitPreExaminationSection(sections));

		let targetSectionName = sectionName;
		/** @type {Record<string, any>} */
		let sectionValues;

		if (sectionName === 'preApplicationSection' || sectionName === 'screeningAndScoping') {
			sectionValues = modifiedSections.preApplication?.[sectionName] || {};
		} else if (
			sectionName === 'relevantRepresentations' ||
			sectionName === 'relevantRepresentationsReOpen' ||
			sectionName === 'otherDates'
		) {
			sectionValues = modifiedSections.preExamination?.[sectionName] || {};
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
