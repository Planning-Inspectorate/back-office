/**
 * @file map-key-dates.js
 * @description
 * Utilities for mapping key date fields between API, DB, and event formats.
 *
 * Exports:
 * - mapRequestToKeyDates: Flattens a sectioned request body into a DB-ready object, filtering by allowed keys.
 * - mapKeyDatesToResponse: Maps DB record to sectioned API response (dates as Unix timestamps, string exceptions pass through).
 * - mapKeyDatesToISOStrings: Maps DB record to flat object with all dates as ISO strings (for event broadcasting/schema compatibility).
 *
 * Most fields are Date objects; exceptions (see SECTION_STRING_FIELDS_EXCEPTIONS) are always strings.
 */

import { pick, mapValues } from 'lodash-es';
import {
	acceptanceDateNames,
	allKeyDateNames,
	decisionDateNames,
	examinationDateNames,
	postDecisionDateNames,
	preApplicationDateNames,
	preExaminationDateNames,
	recommendationDateNames,
	withdrawalDateNames
} from '../../applications/key-dates/key-dates.utils.js';
import { mapDateToUnixTimestamp } from '#utils/mapping/map-date-to-unix-timestamp.js';

/**
 * Enum for date mapping output type.
 * @readonly
 * @enum {string}
 */
export const DateFormatType = Object.freeze({
	UNIX: 'unix', // Output as Unix timestamp (number)
	ISO: 'iso' // Output as ISO string (e.g., 2026-04-15T12:34:56.000Z)
});

/**
 * Defines string field exceptions for each section.
 * These fields are always treated as strings, not dates, for their respective sections.
 * This avoids magic strings in mapping logic and centralizes exception handling.
 */
export const SECTION_STRING_FIELDS_EXCEPTIONS = Object.freeze({
	preApplication: ['submissionAtPublished'],
	postDecision: ['courtDecisionOutcome', 'courtDecisionOutcomeText']
});

/**
 * Flattens a sectioned key dates request body into a single object keyed by field name,
 * filtered by the allowed key date names. Used for DB writes.
 *
 * @param {Object<string, Object<string, any>>} keyDateRequest - Sectioned key dates object from API request
 * @returns {Object<string, any>} Flattened and filtered key dates for DB
 */
export const mapRequestToKeyDates = ({
	preApplication,
	preExamination,
	examination,
	recommendation,
	decision,
	postDecision,
	withdrawal,
	acceptance
}) => {
	const allKeyDates = {
		...preApplication,
		...preExamination,
		...examination,
		...recommendation,
		...decision,
		...postDecision,
		...withdrawal,
		...acceptance
	};

	// Collect unique allowed key date names
	const keyDateNames = Object.keys(allKeyDates).reduce((uniqueNames, currentName) => {
		const keyDateName = currentName.split('.')[0];
		if (allKeyDateNames.includes(keyDateName)) {
			return uniqueNames.includes(keyDateName) ? uniqueNames : [...uniqueNames, keyDateName];
		}
		return uniqueNames;
	}, /** @type {string[]} */ ([]));

	// Build result object with allowed keys only
	return keyDateNames.reduce((keyDates, keyDateName) => {
		return { ...keyDates, [keyDateName]: allKeyDates[keyDateName] || null };
	}, /** @type {Record<string, any>} */ ({}));
};

/**
 * Maps a single field to a Unix timestamp, ISO string, or passthrough string, depending on mode and field type.
 *
 * @param {Date|string} value - The field value (Date or string)
 * @param {string} key - The field name
 * @param {DateFormatType} mode - Output format (UNIX or ISO)
 * @param {string[]} stringFields - Field names to always treat as strings for this section
 * @param {string|null} [emptyStringValue] - Value to use for empty string fields (default: '' for UNIX, null for ISO)
 * @returns {string|number|null} The mapped value
 */
function mapDateField(value, key, mode, stringFields = [], emptyStringValue) {
	if (emptyStringValue === undefined) {
		emptyStringValue = mode === DateFormatType.UNIX ? '' : null;
	}
	if (stringFields.includes(key)) {
		return `${value ?? emptyStringValue}`;
	}
	if (mode === DateFormatType.UNIX) {
		return value instanceof Date ? mapDateToUnixTimestamp(value) : null;
	}
	if (mode === DateFormatType.ISO) {
		return value instanceof Date ? value.toISOString() : null;
	}
	return null;
}

/**
 * Maps a DB record to a sectioned API response object.
 * Date fields are converted to Unix timestamps; string fields (see SECTION_STRING_FIELDS_EXCEPTIONS) pass through as-is.
 * Used by GET endpoints.
 *
 * @param {import('@pins/applications.api').Schema.ApplicationDetails} keyDates - DB record of key dates
 * @returns {Object<string, Object<string, any>>} Sectioned API response
 */
export const mapKeyDatesToResponse = (keyDates) => {
	return {
		preApplication: mapValues(pick(keyDates, preApplicationDateNames), (value, key) =>
			mapDateField(
				value,
				key,
				DateFormatType.UNIX,
				SECTION_STRING_FIELDS_EXCEPTIONS.preApplication,
				''
			)
		),
		acceptance: mapValues(pick(keyDates, acceptanceDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		),
		preExamination: mapValues(pick(keyDates, preExaminationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		),
		examination: mapValues(pick(keyDates, examinationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		),
		recommendation: mapValues(pick(keyDates, recommendationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		),
		decision: mapValues(pick(keyDates, decisionDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		),
		postDecision: mapValues(pick(keyDates, postDecisionDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX, SECTION_STRING_FIELDS_EXCEPTIONS.postDecision)
		),
		withdrawal: mapValues(pick(keyDates, withdrawalDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.UNIX)
		)
	};
};

/**
 * Maps a DB record to a flat object with all dates as ISO strings (for event broadcasting/schema compatibility).
 * String fields pass through as-is.
 *
 * @param {import('@pins/applications.api').Schema.ApplicationDetails} keyDates
 * @returns {Object<string, string|null>} Flat object with ISO string values
 */
export const mapKeyDatesToISOStrings = (keyDates) => {
	/** @type {Record<string, string|null>} */
	let allKeyDatesConverted = {};
	const allDates = {
		preApplication: mapValues(pick(keyDates, preApplicationDateNames), (value, key) =>
			mapDateField(
				value,
				key,
				DateFormatType.ISO,
				SECTION_STRING_FIELDS_EXCEPTIONS.preApplication,
				null
			)
		),
		acceptance: mapValues(pick(keyDates, acceptanceDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		),
		preExamination: mapValues(pick(keyDates, preExaminationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		),
		examination: mapValues(pick(keyDates, examinationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		),
		recommendation: mapValues(pick(keyDates, recommendationDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		),
		decision: mapValues(pick(keyDates, decisionDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		),
		postDecision: mapValues(pick(keyDates, postDecisionDateNames), (value, key) =>
			mapDateField(
				value,
				key,
				DateFormatType.ISO,
				SECTION_STRING_FIELDS_EXCEPTIONS.postDecision,
				null
			)
		),
		withdrawal: mapValues(pick(keyDates, withdrawalDateNames), (value, key) =>
			mapDateField(value, key, DateFormatType.ISO)
		)
	};

	Object.assign(
		allKeyDatesConverted,
		allDates.preApplication,
		allDates.acceptance,
		allDates.preExamination,
		allDates.examination,
		allDates.recommendation,
		allDates.decision,
		allDates.postDecision,
		allDates.withdrawal
	);

	return allKeyDatesConverted;
};
