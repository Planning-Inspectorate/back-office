import { removeNullValues } from '../utils.js';
import { makePostRequest } from '../back-office-api-client.js';
import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';

/**
 * Migrate a nsip-exam-timetables
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export async function migrateExamTimetables(log, caseReferences) {
	log.info(`Migrating Timetables for ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		await migrateExamTimetablesForCase(log, caseReference);
	}
}

/**
 * Migrate a nsip-exam-timetables for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export async function migrateExamTimetablesForCase(log, caseReference) {
	try {
		log.info(`Migrating Exam Timetable for case ${caseReference}`);

		const examTimetable = await getExamTimetable(log, caseReference);

		if (examTimetable) {
			log.info(`Migrating Exam Timetable Items for case ${caseReference}`);

			await makePostRequest(log, '/migration/nsip-exam-timetable', [examTimetable]);

			log.info(`Successfully migrated Exam Timetable for case ${caseReference}`);
		} else {
			log.warn(`No Exam Timetable found for case ${caseReference}`);
		}
	} catch (e) {
		log.error(`Failed to migrate Exam Timetable for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 *
 * @returns {Promise<import('pins-data-model').Schemas.ExaminationTimetable | null>} timetable
 */
const getExamTimetable = async (log, caseReference) => {
	/** @type {ExamTimetableItemRow[]}} */
	const timetableItems = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[examination_timetable] WHERE caseReference = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	if (!timetableItems.length) {
		return null;
	}

	log.info(`Retrieved Timetable Items ${JSON.stringify(timetableItems)}`);

	return mapTimetableFromItems(caseReference, timetableItems);
};

/**
 * @typedef {Object} ExamTimetableItemRow
 * @property {string} eventID
 * @property {'Accompanied Site Inspection' | 'Compulsory Acquisition Hearing' | 'Deadline' | 'Deadline For Close Of Examination' | 'Issued By' | 'Issue Specific Hearing' | 'Open Floor Hearing' | 'Other Meeting' | 'Preliminary Meeting' | 'Procedural Deadline (Pre-Examination)' | 'Procedural Decision' | 'Publication Of'} eventType
 * @property {string} eventTitle
 * @property {string} eventDeadlineStartDate
 * @property {string} eventDate
 * @property {string} eventLineItemDescription
 */

/**
 *
 * @param {string} caseReference
 * @param {ExamTimetableItemRow[]} timetableItems
 * @returns {import('pins-data-model').Schemas.ExaminationTimetable} timetable
 */
const mapTimetableFromItems = (caseReference, timetableItems) => {
	/** @type {import('pins-data-model').Schemas.ExaminationTimetable} */
	const timetable = {
		caseReference,
		events: []
	};

	return timetableItems.reduce(
		(
			timetable,
			{
				eventID,
				eventType,
				eventTitle,
				eventDate,
				eventDeadlineStartDate,
				eventLineItemDescription
			}
		) => {
			timetable.events.push(
				removeNullValues({
					eventId: Number(eventID),
					type: eventType,
					eventTitle,
					description: eventLineItemDescription,
					date: eventDate,
					eventDeadlineStartDate
				})
			);

			return timetable;
		},
		timetable
	);
};
