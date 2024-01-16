import { SynapseDB } from '../../common/synapse-db.js';
import { QueryTypes } from 'sequelize';

/**
/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export const migrateExamTimetables = async (log, caseReferences) => {
	log.info(`Migrating Timetables for ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		try {
			log.info(`Migrating Exam Timetable for case ${caseReference}`);

			const examTimetable = await getExamTimetable(log, caseReference);

			if (examTimetable) {
				log.info(`Migrating Exam Timetable Items for case ${caseReference}`);

				// TODO: Make request to API

				log.info(`Successfully migrated Exam Timetable for case ${caseReference}`);
			} else {
				log.warn(`No Exam Timetable found for case ${caseReference}`);
			}
		} catch (e) {
			log.error(`Failed to migrate Exam Timetable for case ${caseReference}`, e);
			throw e;
		}
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
const getExamTimetable = async (log, caseReference) => {
	const timetableItems = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[examination_timetable] WHERE caseReference = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	log.info(`Retrieved Timetable Items ${JSON.stringify(timetableItems)}`);

	// TODO: Flatten into ExaminationTimetable entity

	return {};
};
