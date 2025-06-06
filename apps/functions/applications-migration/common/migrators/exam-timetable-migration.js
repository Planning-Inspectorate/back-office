import { makePostRequestStreamResponse } from '../back-office-api-client.js';
import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';

/**
 * Migrate a nsip-exam-timetables for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrateExamTimetablesForCase = async (log, caseReference) => {
	try {
		log.info(`Migrating Exam Timetable for case ${caseReference}`);

		const examTimetable = await getExamTimetable(log, caseReference);

		if (examTimetable) {
			log.info(`Migrating Exam Timetable Items for case ${caseReference}`);
			return makePostRequestStreamResponse(log, '/migration/nsip-exam-timetable', [examTimetable]);
		} else {
			log.warn(`No Exam Timetable found for case ${caseReference}`);
		}
	} catch (e) {
		throw new Error(`Failed to migrate Exam Timetable for case ${caseReference}`, { cause: e });
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 *
 * @returns {Promise<import('pins-data-model').Schemas.ExaminationTimetable | null>} timetable
 */
export const getExamTimetable = async (log, caseReference) => {
	/** @type {ExamTimetableItemRow[]} */
	const timetableItems = await SynapseDB.query(
		'SELECT * FROM [odw_curated_migration_db].[dbo].[nsip_exam_timetable] WHERE caseReference = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	if (!timetableItems.length) {
		return null;
	}

	const examTimetableItem = timetableItems[0]; // should only be one item
	return mapTimetableFromItems(examTimetableItem);
};

/**
 * @typedef {Object} ExamTimetableItemRow
 * @property {string} caseReference
 * @property {boolean} published
 * @property {string} events
 */

/**
 *
 * @param {ExamTimetableItemRow} timetableItems
 * @returns {import('pins-data-model').Schemas.ExaminationTimetable} timetable
 */
const mapTimetableFromItems = (timetableItems) => {
	const events = JSON.parse(timetableItems.events).map((event) => ({
		...event,
		type: timetableEventTypeOverride(event.type)
	}));
	const filteredEvents = filterEventItems(events);
	/** @type {import('pins-data-model').Schemas.ExaminationTimetable} */
	return {
		caseReference: timetableItems.caseReference,
		published: timetableItems.published,
		events: filteredEvents
	};
};

/**
 * Override event type to new type
 * @param type
 * @returns {*|string}
 */
const timetableEventTypeOverride = (type) => {
	switch (type) {
		case 'Site Visit (Accompanied)':
			return 'Accompanied Site Inspection';
		default:
			return type;
	}
};

/**
 * Filter out unwanted event types that are not to be migrated
 * @param events
 * @returns {*}
 */
const filterEventItems = (events) => {
	const eventItemTypesToRemove = ['Site Visit (Unaccompanied)'];
	return events.filter((event) => !eventItemTypesToRemove.includes(event.type));
};
